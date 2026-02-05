import pandas as pd
import os

# File Paths
caramia_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\#05 Caramia May 2023.xls"
lazada_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"

def load_caramia():
    print(f"Loading {os.path.basename(caramia_path)}...")
    df = pd.read_excel(caramia_path)
    # Columns: 'Stock Moves/Product/Internal Reference', 'Stock Moves/Quantity Done'
    # Rename for consistency
    df = df.rename(columns={
        'Stock Moves/Product/Internal Reference': 'SKU',
        'Stock Moves/Quantity Done': 'Qty_Caramia',
        'Stock Moves/Product/Name': 'Description'
    })
    # Aggregate by SKU
    agg = df.groupby('SKU')[['Qty_Caramia']].sum().reset_index()
    return agg

def load_lazada():
    print(f"Loading {os.path.basename(lazada_path)}...")
    # Load without header to manually map
    df = pd.read_excel(lazada_path, header=None)
    
    # We know row 24 (0-indexed) is the header-ish row, data starts at 25.
    # Col 0: SKU
    # Col 4: Qty
    
    # Rename columns manually by index
    # Need to protect against index out of bounds if file is smaller, but unlikely here.
    df = df.iloc[25:].copy()
    
    # Select only needed columns by index
    df = df[[0, 1, 4]].copy()
    df.columns = ['SKU', 'Description_Luz', 'Qty_Lazada']
    
    print(f"Lazada Loaded {len(df)} rows.")

    if 'SKU' not in df.columns:
        print(f"Error: SKU column missing. Current columns: {df.columns.tolist()}")
        return pd.DataFrame(columns=['SKU', 'Qty_Lazada'])

    # Filter rows that have a valid SKU
    df = df[df['SKU'].notna()]
    
    # Ensure Qty is numeric
    df['Qty_Lazada'] = pd.to_numeric(df['Qty_Lazada'], errors='coerce').fillna(0)
    
    # Aggregate by SKU
    agg = df.groupby('SKU')[['Qty_Lazada']].sum().reset_index()
    return agg

def compare():
    df_c = load_caramia()
    df_l = load_lazada()
    
    print("\n--- Merging Data ---")
    merged = pd.merge(df_c, df_l, on='SKU', how='outer').fillna(0)
    
    merged['Diff'] = merged['Qty_Caramia'] - merged['Qty_Lazada']
    
    # Filter for discrepancies
    discrepancies = merged[merged['Diff'] != 0]
    
    if discrepancies.empty:
        print("No discrepancies found! All quantities match.")
    else:
        print(f"\nFound {len(discrepancies)} discrepancies:")
        print(discrepancies[['SKU', 'Qty_Caramia', 'Qty_Lazada', 'Diff']].to_string(index=False))
        
        # Determine strict mismatches (present in one but not other)
        missing_in_caramia = discrepancies[discrepancies['Qty_Caramia'] == 0]
        missing_in_lazada = discrepancies[discrepancies['Qty_Lazada'] == 0]
        
        if not missing_in_caramia.empty:
            print("\nMissing in Caramia (Present in Lazada):")
            print(missing_in_caramia[['SKU', 'Qty_Lazada']].to_string(index=False))
            
        if not missing_in_lazada.empty:
            print("\nMissing in Lazada (Present in Caramia):")
            print(missing_in_lazada[['SKU', 'Qty_Caramia']].to_string(index=False))

    # Export to CSV
    output_file = os.path.join(os.path.dirname(caramia_path), "discrepancies_report.csv")
    print(f"\nSaving full report to: {output_file}")
    merged.to_csv(output_file, index=False)
    print("Done.")

if __name__ == "__main__":
    compare()
