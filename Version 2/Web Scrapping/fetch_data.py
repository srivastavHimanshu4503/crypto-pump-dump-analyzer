import requests
import pandas as pd
from datetime import datetime, timedelta, timezone
import time

def fetch_coingecko_data(coin_id):
    print(f"Fetching data for {coin_id}...")

    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=365)

    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart/range"
    params = {
        "vs_currency": "usd",
        "from": int(start_date.timestamp()),
        "to": int(end_date.timestamp())
    }

    for attempt in range(3):
        response = requests.get(url, params=params)
        if response.status_code == 429:
            print(f"[⏳] Rate limited for {coin_id}. Retrying in 30s...")
            time.sleep(30)
            continue
        elif response.status_code != 200:
            print(f"[✗] Failed for {coin_id}: {response.status_code}")
            return
        break

    try:
        data = response.json()
        if "prices" not in data or not data["prices"]:
            print(f"[!] No data found for {coin_id}")
            return

        df = pd.DataFrame({
            "date": [datetime.fromtimestamp(p[0] / 1000, tz=timezone.utc).strftime('%Y-%m-%d') for p in data["prices"]],
            "price": [p[1] for p in data["prices"]],
            "volume": [v[1] for v in data.get("total_volumes", [])]
        })

        filename = f"{coin_id.replace('-', '_')}_1year_data.csv"
        df.to_csv(filename, index=False)
        print(f"[✓] Saved: {filename}")

    except Exception as e:
        print(f"[!] Error for {coin_id}: {e}")

# Coin list
coin_ids = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "cardano",
    "litecoin",
    "dogecoin",
    "shiba-inu",
    "pepe",
    "floki",
    "bonk"
]

# Fetch data
for coin in coin_ids:
    fetch_coingecko_data(coin)
    time.sleep(30)  # Respectful delay
