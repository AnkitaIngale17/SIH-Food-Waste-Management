import os
import csv
import re
from datetime import datetime, timedelta

FOOD_UNITS = [
    "kg", "kilo", "kilos", "kilogram", "kilograms",
    "packets", "packet", "plates", "plate",
    "servings", "serving", "trays", "tray",
    "meals", "meal", "boxes", "box",
    "portions", "portion", "thalis", "thali", "containers", "container"
]

NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "fifteen": 15, "twenty": 20,
    "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60,
    "seventy": 70, "eighty": 80, "ninety": 90, "hundred": 100,
}

# Base general food terms callers might use casually
DEFAULT_BASE_FOODS = [
    "rice", "dal", "biryani", "roti", "sabzi", "sabji", "curry", "bread",
    "paneer", "salad", "chapati", "chapathi", "pulao", "pulav", "khichdi",
    "sambar", "sambhar", "poori", "puri", "upma", "poha", "idli", "dosa",
    "paratha", "bhaji", "thali", "meals", "curd rice", "fried rice",
    "noodles", "gravy", "sweet", "sweets", "gulab jamun", "pasta"
]

UNIT_REGEX_FRAGMENT = r"(kg|kilos?|kilograms?|packets?|plates?|servings?|trays?|meals?|boxes?|portions?|thalis?|containers?)"


def load_food_list() -> list[str]:
    """Loads all food items from foods.csv (checking Food_Name or item column)."""
    csv_path = os.path.join(os.path.dirname(__file__), "foods.csv")
    foods = set(DEFAULT_BASE_FOODS)

    if os.path.exists(csv_path):
        try:
            with open(csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Reads Food_Name (from your CSV) or fallback to item/name
                    item = row.get("Food_Name") or row.get("item") or row.get("food_name") or ""
                    item_clean = item.strip().lower()
                    if item_clean:
                        foods.add(item_clean)
        except Exception:
            pass

    # Sort longest first so "vegetable pulao" matches before "pulao"
    return sorted(list(foods), key=len, reverse=True)


COMMON_FOODS = load_food_list()


def normalize_unit(unit_raw: str) -> str:
    unit_raw = unit_raw.lower().strip()
    if "kilo" in unit_raw or unit_raw == "kg":
        return "kg"
    return unit_raw.rstrip("s") + "s"


def extract_quantity_and_unit(text: str):
    text_lower = text.lower()

    match = re.search(rf"(\d+(?:\.\d+)?)\s*{UNIT_REGEX_FRAGMENT}", text_lower)
    if match:
        qty = float(match.group(1))
        unit = normalize_unit(match.group(2))
        return qty, unit

    for word, value in NUMBER_WORDS.items():
        if word in text_lower:
            unit_match = re.search(UNIT_REGEX_FRAGMENT, text_lower)
            unit = normalize_unit(unit_match.group(1)) if unit_match else "packets"
            return float(value), unit

    lone_digit_match = re.search(r"\b(\d+)\b", text_lower)
    if lone_digit_match:
        return float(lone_digit_match.group(1)), "packets"

    return None, None


def extract_food_item(text: str):
    text_lower = text.lower()
    found = []

    for food in COMMON_FOODS:
        pattern = r"\b" + re.escape(food) + r"\b"
        if re.search(pattern, text_lower):
            if not any(food in existing for existing in found):
                found.append(food)

    return " and ".join(found) if found else None


def extract_pickup_time(text: str, now: datetime = None):
    now = now or datetime.utcnow()
    text_lower = text.lower()

    if "hour" in text_lower:
        match = re.search(r"(\d+)\s*hour", text_lower)
        hours = int(match.group(1)) if match else 2
        return now + timedelta(hours=hours)

    match = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.|bm|b\.m\.)", text_lower)
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2)) if match.group(2) else 0
        meridiem = match.group(3).lower()

        if ("pm" in meridiem or "bm" in meridiem) and hour != 12:
            hour += 12
        elif "am" in meridiem and hour == 12:
            hour = 0

        target = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if target < now:
            target += timedelta(days=1)
        return target

    return None


def extract_surplus_fields(text: str) -> dict:
    quantity, unit = extract_quantity_and_unit(text)
    food_item = extract_food_item(text)
    pickup_by = extract_pickup_time(text)

    missing = []
    if not food_item:
        missing.append("foodItem")
    if not quantity:
        missing.append("quantity")
    if not pickup_by:
        missing.append("pickupBy")

    return {
        "foodItem": food_item,
        "quantity": quantity,
        "unit": unit,
        "pickupBy": pickup_by.isoformat() if pickup_by else None,
        "missing_slot": missing[0] if missing else None,
    }