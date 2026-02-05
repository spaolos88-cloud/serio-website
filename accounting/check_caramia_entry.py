import pandas as pd
import os

caramia_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\#05 Caramia May 2023.xls"

def check_caramia():
    print(f"Loading {os.path.basename(caramia_path)}...")
    df = pd.read_excel(caramia_path)
    
    print("\n--- Searching for 'San Lazaro' in Sales Order/Branch/Branch ---")
    # Partner names are in 'Sales Order/Branch/Branch' column
    # normalizing to string just in case
    branches = df['Sales Order/Branch/Branch'].astype(str).unique()
    print("All Branches found:")
    for b in branches:
        print(f"  - {b}")
        
    san_lazaro_branches = [str(b) for b in branches if 'Lazaro' in str(b)]
    print("\nFound Branches matching 'Lazaro':", san_lazaro_branches)
    
    if not san_lazaro_branches:
        print("No branch matching 'Lazaro' found.")
        return

    target_branch = san_lazaro_branches[0]
    
    print(f"\n--- Analyzing entries for Branch: {target_branch} ---")
    df_sl = df[df['Sales Order/Branch/Branch'] == target_branch]
    
    item_code = 'FM0376'
    print(f"Looking for item {item_code}...")
    
    item_rows = df_sl[df_sl['Stock Moves/Product/Internal Reference'] == item_code]
    
    if item_rows.empty:
        print(f"Item {item_code} NOT FOUND for {target_branch}.")
    else:
        print(f"Found {len(item_rows)} entries for {item_code}:")
        print(item_rows[['Received Date', 'Reference', 'Stock Moves/Product/Name', 'Stock Moves/Quantity Done']].to_string())
        
        total_qty = item_rows['Stock Moves/Quantity Done'].sum()
        print(f"\nTotal Quantity in Caramia (San Lazaro): {total_qty}")

if __name__ == "__main__":
    check_caramia()
