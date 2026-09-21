import re
from datetime import datetime, timedelta

FOOD_UNITS = ["kg", "kilo", "kilos", "packets", "packet", "plates", "servings", "trays"]

NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
    "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
    "hundred": 100,
}


def extract_quantity_and_unit(text: str):
    text_lower = text.lower()

    # digit-based: "40 kg", "15 packets"
    match = re.search(r"(\d+(?:\.\d+)?)\s*(kg|kilo|kilos|packets?|plates?|servings?|trays?)", text_lower)
    if match:
        qty = float(match.group(1))
        unit_raw = match.group(2)
        unit = "kg" if "kilo" in unit_raw or unit_raw == "kg" else unit_raw.rstrip("s") + "s"
        return qty, unit

    # word-based: "forty kg"
    for word, value in NUMBER_WORDS.items():
        if word in text_lower:
            unit_match = re.search(r"(kg|kilo|kilos|packets?|plates?|servings?|trays?)", text_lower)
            if unit_match:
                unit_raw = unit_match.group(1)
                unit = "kg" if "kilo" in unit_raw or unit_raw == "kg" else unit_raw.rstrip("s") + "s"
                return float(value), unit

    return None, None


def extract_food_item(text: str):
    # naive: look for common food words; refine later with the kitchen's real menu list
    common_foods = ["rice", "dal", "biryani", "roti", "sabzi", "curry", "bread", "paneer", "salad"]
    found = [food for food in common_foods if food in text.lower()]
    return " and ".join(found) if found else None


def extract_pickup_time(text: str, now: datetime = None):
    now = now or datetime.utcnow()
    text_lower = text.lower()

    if "hour" in text_lower:
        match = re.search(r"(\d+)\s*hour", text_lower)
        hours = int(match.group(1)) if match else 1
        return now + timedelta(hours=hours)

    match = re.search(r"(\d{1,2})\s*(?:pm|p\.m\.)", text_lower)
    if match:
        hour = int(match.group(1))
        if hour != 12:
            hour += 12
        target = now.replace(hour=hour, minute=0, second=0, microsecond=0)
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