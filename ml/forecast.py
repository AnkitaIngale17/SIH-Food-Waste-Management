from pathlib import Path
import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
bundle = joblib.load(BASE_DIR / "models" / "demand_history.joblib")
model = joblib.load(BASE_DIR / "models" / "demand_model.joblib")

def predict_demand(center_id: int, meal_id: int, checkout_price: float, base_price: float, emailer: int = 0, featured: int = 0):
    match = bundle['history'][(bundle['history']['center_id'] == center_id) & (bundle['history']['meal_id'] == meal_id)]
    if match.empty:
        return {"error": "Cold-start: record not found"}

    row = match.iloc[0]
    orders = np.array(row['last_6_orders'], dtype=float)

    # Autoregressive Lags & Rolling Window Features
    lag_1 = float(orders[-1])
    lag_2 = float(orders[-2])
    lag_3 = float(orders[-3])
    lag_4 = float(orders[-4])

    roll_mean_3 = float(np.mean(orders[-3:]))
    roll_std_3 = float(np.std(orders[-3:], ddof=1)) if len(orders[-3:]) > 1 else 0.0
    roll_mean_4 = float(np.mean(orders[-4:]))
    roll_std_4 = float(np.std(orders[-4:], ddof=1)) if len(orders[-4:]) > 1 else 0.0
    roll_mean_6 = float(np.mean(orders))
    roll_std_6 = float(np.std(orders, ddof=1)) if len(orders) > 1 else 0.0
    roll_median_4 = float(np.median(orders[-4:]))

    ewm_mean = float(pd.Series(orders).ewm(span=3).mean().iloc[-1])
    momentum = float(lag_1 - lag_2)

    # Pricing and Promotions
    discount_pct = (base_price - checkout_price) / (base_price or 1.0)
    price_diff = base_price - checkout_price
    cum_mean_price = float(row.get('cum_mean_price', checkout_price)) or 1.0
    price_ratio_to_avg = checkout_price / cum_mean_price

    data = {
        'lag_1': lag_1,
        'lag_2': lag_2,
        'lag_3': lag_3,
        'lag_4': lag_4,
        'roll_mean_3': roll_mean_3,
        'roll_std_3': roll_std_3,
        'roll_mean_4': roll_mean_4,
        'roll_std_4': roll_std_4,
        'roll_mean_6': roll_mean_6,
        'roll_std_6': roll_std_6,
        'roll_median_4': roll_median_4,
        'ewm_mean': ewm_mean,
        'momentum': momentum,
        'checkout_price': checkout_price,
        'base_price': base_price,
        'discount_pct': discount_pct,
        'price_diff': price_diff,
        'emailer_for_promotion': emailer,
        'homepage_featured': featured,
        'emailer_last_wk': row['emailer_for_promotion'],
        'homepage_last_wk': row['homepage_featured'],
        'promo_interaction': emailer * featured,
        'price_ratio_to_avg': price_ratio_to_avg,
        'cum_mean_orders': row['cum_mean_orders'],
        'category': row['category'],
        'cuisine': row['cuisine'],
        'center_type': row['center_type'],
        'city_code': row['city_code'],
        'region_code': row['region_code'],
        'op_area': row['op_area']
    }

    df = pd.DataFrame([data])
    for cat in bundle.get('categorical_features', []):
        if cat in df:
            df[cat] = pd.Categorical(df[cat], categories=bundle['category_levels'].get(cat))

    raw_pred = float(model.predict(df[bundle['features']])[0])
    pred = max(0, round(raw_pred))

    return {
        "expected_demand": pred,
        "min_demand": max(0, round(pred + bundle.get('residual_low_q', 0))),
        "max_demand": round(pred + bundle.get('residual_high_q', 0))
    }
