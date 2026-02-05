import pandas as pd
import os

csv_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\full_discrepancy_details.csv"

def sum_discrepancies():
    if not os.path.exists(csv_path):
        print("CSV report not found.")
        return

    print("Loading discrepancy report...")
    df = pd.read_csv(csv_path)
    
    # Ensure Amount is numeric
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce').fillna(0)
    
    print("\n--- Discrepancy Breakdown by Branch (Sheet) ---")
    summary = df.groupby('Sheet_Name')['Amount'].sum().reset_index()
    summary['Amount'] = summary['Amount'].apply(lambda x: f"{x:,.2f}")
    print(summary.to_string(index=False))
    
    total = df['Amount'].sum()
    print(f"\nGRAND TOTAL DISCREPANCY: {total:,.2f}")
    
    # Specific check for San Lazaro (LAZ (7)) and the 1,044.93 item
    print("\n--- Specific Item Check ---")
    # Looking for approx 1044.93
    target_item = df[(df['Amount'] > 1044.90) & (df['Amount'] < 1044.96)]
    if not target_item.empty:
        print("Found the specific 1,044.93 item:")
        print(target_item.to_string(index=False))
    else:
        print("Did not find an item with exact amount 1,044.93 in the summary csv.")

if __name__ == "__main__":
    sum_discrepancies()
