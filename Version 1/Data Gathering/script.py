import pandas as pd
import os
import os
import json
import pandas as pd

CSV_FOLDER = "csv_data"
EVENT_FOLDER = "events"
os.makedirs(EVENT_FOLDER, exist_ok=True)

def detect_pump_dump_events_flexible(df, price_jump_pct=18, dump_drop_pct=8, volume_spike_factor=1.8, dump_window=5):
    """
    Enhanced version to detect more pump-and-dump events with flexible thresholds and trend awareness.

    Parameters:
        df (pd.DataFrame): Must contain 'date', 'price', 'volume'.
        price_jump_pct (float): Minimum % price increase to detect pump.
        dump_drop_pct (float): Minimum % price drop to detect dump.
        volume_spike_factor (float): Volume spike multiplier over rolling mean.
        dump_window (int): Number of days to look ahead for a dump.

    Returns:
        List of detected events.
    """
    events = []

    # Add rolling average volume (trend aware)
    df["rolling_volume"] = df["volume"].rolling(window=7, min_periods=1).mean()

    for i in range(1, len(df) - dump_window):
        price_prev = df.loc[i - 1, "price"]
        price_now = df.loc[i, "price"]
        volume_now = df.loc[i, "volume"]
        rolling_vol = df.loc[i, "rolling_volume"]

        price_jump = ((price_now - price_prev) / price_prev) * 100
        is_pump = price_jump >= price_jump_pct and volume_now > volume_spike_factor * rolling_vol

        if is_pump:
            # Look ahead for dump within the window
            for j in range(1, dump_window + 1):
                if i + j >= len(df):
                    break
                future_price = df.loc[i + j, "price"]
                price_drop = ((price_now - future_price) / price_now) * 100
                if price_drop >= dump_drop_pct:
                    events.append({
                        "pump_date": str(df.loc[i, "date"].date()),
                        "pump_price": round(price_now, 6),
                        "pump_volume": int(volume_now),
                        "dump_date": str(df.loc[i + j, "date"].date()),
                        "dump_price": round(future_price, 6),
                        "dump_volume": int(df.loc[i + j, "volume"])
                    })
                    break  # Avoid multiple dumps for one pump

    return events

def save_events_to_json(coin, events):
    filename = f"{EVENT_FOLDER}/{coin.lower()}_events.json"
    with open(filename, "w") as f:
        json.dump(events, f, indent=2)
    print(f"[✓] Saved {len(events)} events for {coin} -> {filename}")


def load_coin_data(coin):
    path = os.path.join(CSV_FOLDER, f"{coin.lower()}_1year_data.csv")
    if not os.path.exists(path):
        print(f"[✗] Missing CSV for {coin}")
        return None
    df = pd.read_csv(path)
    df['date'] = pd.to_datetime(df['date'])
    return df

coins = ["bitcoin", "ethereum", "binancecoin", "cardano", "litecoin", "dogecoin", "shiba_inu", "pepe", "floki", "bonk"]

for coin in coins:
    print(f"Analyzing: {coin}")
    df = load_coin_data(coin)
    if df is None:
        continue

    events = detect_pump_dump_events_flexible(df)

    save_events_to_json(coin, events)

