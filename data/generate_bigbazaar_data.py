import pandas as pd
import random

rows = 10000

categories = ["Grocery", "Electronics", "Clothing", "Home & Kitchen", "Personal Care"]
outlet_types = ["Hypermarket", "Supermarket", "Convenience Store"]
outlet_sizes = ["Small", "Medium", "Large"]
age_groups = ["18-25", "26-35", "36-45", "46+"]
years = [2020, 2021, 2022, 2023, 2024]

# India regions, states & cities
india_data = {
    "North": {
        "Delhi": ["New Delhi"],
        "Haryana": ["Gurgaon", "Faridabad"],
        "Punjab": ["Ludhiana", "Amritsar"]
    },
    "West": {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Gujarat": ["Ahmedabad", "Surat"]
    },
    "South": {
        "Karnataka": ["Bengaluru", "Mysuru"],
        "Tamil Nadu": ["Chennai", "Coimbatore"],
        "Telangana": ["Hyderabad"]
    },
    "East": {
        "West Bengal": ["Kolkata", "Durgapur"],
        "Odisha": ["Bhubaneswar", "Cuttack"]
    }
}

def get_city_tier(city):
    tier1 = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad"]
    tier2 = ["Pune", "Ahmedabad", "Coimbatore", "Surat"]
    if city in tier1:
        return "Tier 1"
    elif city in tier2:
        return "Tier 2"
    else:
        return "Tier 3"

data = []

for i in range(rows):
    region = random.choice(list(india_data.keys()))
    state = random.choice(list(india_data[region].keys()))
    city = random.choice(india_data[region][state])

    category = random.choice(categories)
    price = random.randint(30, 5000)
    units = random.randint(1, 120)
    total_sales = price * units

    profit_margin = {
        "Grocery": 0.08,
        "Electronics": 0.18,
        "Clothing": 0.15,
        "Home & Kitchen": 0.12,
        "Personal Care": 0.20
    }

    profit = round(total_sales * profit_margin[category], 2)

    data.append({
        "Item_ID": f"BB{i+1:05d}",
        "Item_Category": category,
        "Item_Price": price,
        "Units_Sold": units,
        "Total_Sales": total_sales,
        "Profit": profit,
        "Outlet_Type": random.choice(outlet_types),
        "Outlet_Size": random.choice(outlet_sizes),
        "Region": region,
        "State": state,
        "City": city,
        "City_Tier": get_city_tier(city),
        "Store_Age": random.randint(1, 15),
        "Customer_Age_Group": random.choice(age_groups),
        "Year": random.choice(years)
    })

df = pd.DataFrame(data)
df.to_csv("bigbazaar_sales_10k_india.csv", index=False)

print("✅ bigbazaar_sales_10k_india.csv generated successfully!")
