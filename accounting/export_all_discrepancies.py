import pandas as pd
import os
import re

lazada_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"

def export_full_details():
    print(f"Loading {os.path.basename(lazada_path)}...")
    xl = pd.ExcelFile(lazada_path)
    
    all_rows = []
    
    for sheet in xl.sheet_names:
        # Skip summary sheets or known non-transaction lists if any
        if sheet == "ITEM LIST": continue
        
        print(f"Processing {sheet}...")
        try:
            # We assume a structure similar to what we saw:
            # Header often around row 20-30, data follows.
            # But the structure might vary. 
            # Strategy: Load without header, find the row with "ITEM CODE" or similar, use that as header.
            # Or simpler: Just dump everything with the Sheet Name attached.
            
            # Better Approach:
            # usage of known column indices:
            # 0: SKU/Item Code
            # 1: Description
            # 4: Quantity
            # 7: Amount (Total)
            
            df = xl.parse(sheet, header=None)
            
            # Simple heuristic to identify data rows:
            # Column 0 looks like an Item Code (e.g. FMxxxx, CMxxxx)
            
            def is_item_code(val):
                if not isinstance(val, str): return False
                return bool(re.match(r'^[FC]M\d+', val))
            
            # Filter rows where Col 0 is an Item Code
            data_rows = df[df[0].apply(is_item_code)].copy()
            
            if data_rows.empty:
                print(f"  No item rows found in {sheet}.")
                continue
                
            # Select relevant columns
            # 0: SKU, 1: Desc, 4: Qty, 6: Unit Price?, 7: Total Amount
            # We'll stick to 0, 1, 4, 7 based on inspection of LAZ (7)
            
            # Handle cases where columns might be shifted? 
            # In LAZ (7), Amount was col 7. In others it might differ.
            # But usually templates are consistent.
            
            subset = data_rows[[0, 1, 4]].copy()
            subset.columns = ['SKU', 'Description', 'Quantity']
            
            # Try to get Amount if it exists (Col 7)
            if 7 in data_rows.columns:
                subset['Amount'] = data_rows[7]
            else:
                subset['Amount'] = 0
            
            subset['Sheet_Name'] = sheet
            subset['Status_In_Caramia'] = 'MISSING' # verified by previous step
            
            all_rows.append(subset)
            
        except Exception as e:
            print(f"Error processing {sheet}: {e}")
            
    if all_rows:
        final_df = pd.concat(all_rows, ignore_index=True)
        
        output_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\full_discrepancy_details.csv"
        print(f"\nSaving {len(final_df)} rows to {output_path}...")
        final_df.to_csv(output_path, index=False)
        print("Done.")
    else:
        print("No data extracted.")

if __name__ == "__main__":
    export_full_details()
