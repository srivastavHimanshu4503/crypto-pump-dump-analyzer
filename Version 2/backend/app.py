from flask import Flask, request, render_template
from flask_cors import CORS
import pandas as pd
import plotly.graph_objs as go
import plotly.offline as pyo
import os

app = Flask(__name__)
CORS(app)

def generate_plot(df, traces, layout_title, filename):
    output_dir = os.path.join("templates", "graphs")
    os.makedirs(output_dir, exist_ok=True)

    layout = go.Layout(
        title=f"{layout_title.capitalize()}",
        xaxis=dict(title='Date'),
        yaxis=dict(
            title=dict(
                text="Price",
                font=dict(color="royalblue")
            )
        ),
        yaxis2=dict(
            title=dict(
                text="Volume",
                font=dict(color="limegreen")
            ),
            overlaying='y',
            side='right'
        ),
        legend=dict(x=50, y=1.1),
    )


    fig = go.Figure(data=traces, layout=layout)
    output_path = f"templates/graphs/{filename}.html"
    pyo.plot(fig, filename=output_path, auto_open=False)
    return f"http://127.0.0.1:3000/templates/graphs/{filename}.html"

def get_description(df, column):
    min_val = df[column].min()
    max_val = df[column].max()
    avg_val = df[column].mean()
    return f"The {column} ranges from {min_val:.2f} to {max_val:.2f} with an average of {avg_val:.2f}. This metric helps in identifying potential pump or dump trends."

def generate_summary(df):
    pump_dates = df[df['is_pump']]['date'].tolist()
    dump_dates = df[df['is_dump']]['date'].tolist()

    summary = f"Total Pumps: {len(pump_dates)}, Total Dumps: {len(dump_dates)}"
    notable_periods = {
        "Pumps": pump_dates,
        "Dumps": dump_dates
    }

    return summary, notable_periods

@app.route("/analyze")
def analyze():
    coin = request.args.get("coin", "bitcoin")
    pump_price = float(request.args.get("pump_price", 5))
    pump_volume = float(request.args.get("pump_volume", 50))
    dump_price = float(request.args.get("dump_price", 5))
    dump_volume = float(request.args.get("dump_volume", 50))

    file_path = f"backend/csv_data/{coin}_1year_data.csv"
    if not os.path.exists(file_path):
        return f"<h2>CSV for '{coin}' not found!</h2>"

    df = pd.read_csv(file_path)
    df['price_change_pct'] = df['price'].pct_change() * 100
    df['volume_change_pct'] = df['volume'].pct_change() * 100
    df['is_pump'] = (df['price_change_pct'] > pump_price) & (df['volume_change_pct'] > pump_volume)
    df['is_dump'] = (df['price_change_pct'] < -dump_price) & (df['volume_change_pct'] > dump_volume)

    # Generate price only graph
    price_trace = go.Scatter(x=df['date'], y=df['price'], mode='lines', name='Price', yaxis="y", line=dict(color='blue'))
    price_graph_url = generate_plot(df, [price_trace], f"{coin.capitalize()} Price Only", f"{coin}_price")
    price_description = get_description(df, 'price')

    # Generate volume only graph
    volume_trace = go.Scatter(x=df['date'], y=df['volume'], mode='lines', name='Volume', yaxis="y2",line=dict(color='green'))
    volume_graph_url = generate_plot(df, [volume_trace], f"{coin.capitalize()} Volume Only", f"{coin}_volume")
    volume_description = get_description(df, 'volume')

    # Combined graph
    pump_trace = go.Scatter(
        x=df[df['is_pump']]['date'],
        y=df[df['is_pump']]['price'],
        mode='markers',
        name='Pump',
        marker=dict(color='orange', size=10, symbol='circle')
    )
    dump_trace = go.Scatter(
        x=df[df['is_dump']]['date'],
        y=df[df['is_dump']]['price'],
        mode='markers',
        name='Dump',
        marker=dict(color='red', size=10, symbol='x')
    )
    combined_graph_url = generate_plot(df, [price_trace, volume_trace, pump_trace, dump_trace], f"{coin.capitalize()} Price + Volume", f"{coin}_combined")

    summary, notable_periods = generate_summary(df)
    return render_template("analyze_result.html",
        coin=coin,
        price_graph_url=price_graph_url,
        price_description=price_description,
        volume_graph_url=volume_graph_url,
        volume_description=volume_description,
        combined_graph_url=combined_graph_url,
        summary=summary,
        notable_periods=notable_periods
    )


if __name__ == "__main__":
    app.run(debug=True)
