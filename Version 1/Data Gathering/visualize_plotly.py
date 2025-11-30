import os
import pandas as pd
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import json
from datetime import datetime

# Directories
data_dir = "csv_data"
event_dir = "events"
output_dir = "plots_with_volume_using_plotly"
os.makedirs(output_dir, exist_ok=True)

# Helper to load events
def load_events(event_path):
    if not os.path.exists(event_path):
        return []
    with open(event_path, "r") as f:
        return json.load(f)

# Apply fix and regenerate plots
for filename in os.listdir(data_dir):
    if filename.endswith("_1year_data.csv"):
        coin = filename.replace("_1year_data.csv", "")
        csv_path = os.path.join(data_dir, filename)
        event_path = os.path.join(event_dir, f"{coin}_events.json")
        output_path = os.path.join(output_dir, f"{coin}_price_volume_plot.html")

        df = pd.read_csv(csv_path)
        df["date"] = pd.to_datetime(df["date"]).dt.date
        events = load_events(event_path)

        # Create subplot with secondary y-axis for volume
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(go.Scatter(x=df["date"], y=df["price"], name="Price", line=dict(color="blue")), secondary_y=False)
        fig.add_trace(go.Bar(x=df["date"], y=df["volume"], name="Volume", marker_color="red", opacity=1), secondary_y=True)

        # Add pump-dump highlights
        for event in events:
            try:
                pump_date = datetime.strptime(event["pump_date"], "%Y-%m-%d").date()
                dump_date = datetime.strptime(event["dump_date"], "%Y-%m-%d").date()
                fig.add_vrect(
                    x0=pump_date,
                    x1=dump_date,
                    fillcolor="green",
                    opacity=0.9,
                    layer="below",
                    line_width=0,
                    annotation_text="Pump-Dump",
                    annotation_position="top left"
                )
            except Exception as e:
                print(f"[!] Error adding highlight for {coin}: {e}")

        fig.update_layout(
            title=f"{coin.capitalize()} Price and Volume with Pump-Dump Mark",
            xaxis_title="Date",
            yaxis_title="Price",
            yaxis2_title="Volume",
            template="plotly_white"
        )

        fig.write_html(output_path)

print(output_dir)
