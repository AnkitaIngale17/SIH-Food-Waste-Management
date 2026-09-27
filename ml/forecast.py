from pathlib import Path
import joblib, pandas as pd

BASE_DIR = Path(__file__).resolve().parent
bundle = joblib.load(BASE_DIR / "models" / "demand_history.joblib")
model = joblib.load(BASE_DIR / "models" / "demand_model.joblib")


def predict_demand(center_id: int, meal_id: int, checkout_price: float, base_price: float, emailer: int = 0, featured: int = 0):
    match = bundle['history'][(bundle['history']['center_id'] == center_id) & (bundle['history']['meal_id'] == meal_id)]
    if match.empty:
        return {"error": "Cold-start: record not found"}

    data = match.iloc[0].to_dict()
    data.update({
        'checkout_price': checkout_price,
        'base_price': base_price,
        'discount_pct': (base_price - checkout_price) / (base_price or 1),
        'price_diff': base_price - checkout_price,
        'emailer_for_promotion': emailer,
        'homepage_featured': featured,
        'promo_interaction': emailer * featured
    })

    pred = max(0, round(float(model.predict(pd.DataFrame([data])[bundle['features']])[0])))
    return {
        "expected_demand": pred,
        "min_demand": max(0, round(pred + bundle.get('residual_low_q', 0))),
        "max_demand": round(pred + bundle.get('residual_high_q', 0))
    }