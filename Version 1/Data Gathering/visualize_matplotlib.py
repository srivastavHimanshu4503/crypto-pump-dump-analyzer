import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

CSV_FOLDER = "csv_data"
EVENTS_FOLDER = "events"
OUTPUT_FOLDER = "plots_with_volume_using_matplotlib"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def load_events(coin):
    path = os.path.join(EVENTS_FOLDER, f"{coin}_events.json")
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def plot_price_volume_with_events(coin):
    csv_path = os.path.join(CSV_FOLDER, f"{coin}.csv")
    df = pd.read_csv(csv_path)
    df['date'] = pd.to_datetime(df['date'])

    events = load_events(coin)

    fig, ax1 = plt.subplots(figsize=(14, 6))

    # Plot price
    ax1.plot(df['date'], df['price'], label="Price", color='blue')
    ax1.set_ylabel("Price (USD)", color='blue')
    ax1.tick_params(axis='y', labelcolor='blue')

    # Mark events
    for e in events:
        start = pd.to_datetime(e['start'])
        end = pd.to_datetime(e['end'])
        ax1.axvspan(start, end, color='red', alpha=0.3)

    # Plot volume on second y-axis
    ax2 = ax1.twinx()
    ax2.plot(df['date'], df['volume'], label="Volume", color='orange', alpha=0.6)
    ax2.set_ylabel("Volume", color='orange')
    ax2.tick_params(axis='y', labelcolor='orange')

    plt.title(f"{coin.capitalize()} - Price & Volume with Events")
    fig.tight_layout()

    # Save plot
    output_path = os.path.join(OUTPUT_FOLDER, f"{coin}_price_volume_plot.png")
    plt.savefig(output_path)
    plt.close()
    print(f"[✓] Saved Price+Volume plot for {coin} -> {output_path}")

# Plot for all coins
coins = [f.replace(".csv", "") for f in os.listdir(CSV_FOLDER) if f.endswith(".csv")]

for coin in coins:
    plot_price_volume_with_events(coin)
