import os
import pandas as pd

# Define folders
input_folder = 'csv_data'
output_folder = 'csv_data_processed'
os.makedirs(output_folder, exist_ok=True)

# Pump/Dump static thresholds (can later be replaced by user input)
PRICE_THRESHOLD = 5  # in percent
VOLUME_THRESHOLD = 50  # in percent

# Process all CSVs
for filename in os.listdir(input_folder):
    if filename.endswith('.csv'):
        coin_name = filename.replace('_1year_data.csv', '')
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, f"{coin_name}_1year_data_with_flags.csv")

        print(f"Processing: {coin_name}")

        # Load data
        df = pd.read_csv(input_path)

        # Calculate % changes
        df['price_change_pct'] = df['price'].pct_change() * 100
        df['volume_change_pct'] = df['volume'].pct_change() * 100

        # Flag pump and dump
        df['is_pump'] = (df['price_change_pct'] > PRICE_THRESHOLD) & (df['volume_change_pct'] > VOLUME_THRESHOLD)
        df['is_dump'] = (df['price_change_pct'] < -PRICE_THRESHOLD) & (df['volume_change_pct'] > VOLUME_THRESHOLD)

        # Save processed file
        df.to_csv(output_path, index=False)
        print(f"Saved: {output_path}")
