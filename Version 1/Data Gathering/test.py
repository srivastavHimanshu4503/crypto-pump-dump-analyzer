import os
import json
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
from plotly.subplots import make_subplots

DATA_DIR = "csv_data"
EVENTS_DIR = "events"
OUTPUT_DIR = "plots_with_volume_using_plotly"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def plot_crypto_with_events(coin_name):
    csv_file = os.path.join(DATA_DIR, f"{coin_name}_1year_data.csv")
    json_file = os.path.join(EVENTS_DIR, f"{coin_name}_events.json")

    if not os.path.exists(csv_file):
        print(f"[✗] CSV not found: {csv_file}")
        return

    df = pd.read_csv(csv_file)
    df.columns = df.columns.str.strip().str.lower()
    df['date'] = pd.to_datetime(df['date']).dt.date
    print("CSV 'date' column type:", type(df['date'].iloc[0]))

    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Plot price line
    fig.add_trace(
        go.Scatter(x=df['date'], y=df['price'], name="Price", line=dict(color='blue')),
        secondary_y=False,
    )

    # Plot volume bar
    fig.add_trace(
        go.Bar(x=df['date'], y=df['volume'], name="Volume", marker_color='red', opacity=1),
        secondary_y=True,
    )

    # Add vrect from event file if available
    if os.path.exists(json_file):
        with open(json_file, 'r') as f:
            events = json.load(f)
        for event in events:
            pump_date = datetime.strptime(event['pump_date'], '%Y-%m-%d').date()
            dump_date = datetime.strptime(event['dump_date'], '%Y-%m-%d').date()

            if pump_date in df['date'].values and dump_date in df['date'].values:
                print(f"✅ Event matched: {pump_date} to {dump_date}")
                fig.add_vrect(
                    x0=pump_date,
                    x1=dump_date,
                    fillcolor="red",
                    opacity=0.7,
                    layer="below",
                    line_width=0,
                    annotation_text="Pump-Dump",
                    annotation_position="top left"
                )
            else:
                print(f"❌ No match found for: {pump_date} to {dump_date}")
                print("CSV Dates Sample:", df['date'].head(10).tolist())

    # Manual TEST vrect to confirm vrect is rendering
    fig.add_vrect(
        x0=pump_date,
        x1=dump_date,
        fillcolor="green",
        opacity=0.3,  # Lower opacity = clearer background highlight
        layer="below",
        line_width=0,
        annotation_text="Pump-Dump",  # Optional label
        annotation_position="top left"
    )


    fig.update_layout(
        title=f"{coin_name.capitalize()} - Price and Volume (with Pump-Dump Events)",
        xaxis_title="Date",
        yaxis_title="Price",
        yaxis2_title="Volume",
        template="plotly_white",
        legend=dict(orientation="h", y=1.1)
    )

    fig.write_html(os.path.join(OUTPUT_DIR, f"{coin_name}_price_volume_plot.html"))
    print(f"[✓] Saved interactive plot for {coin_name} -> {OUTPUT_DIR}/{coin_name}_price_volume_plot.html")

# Test with Floki or any coin that has a known event
plot_crypto_with_events("floki")