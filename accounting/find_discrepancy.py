import pandas as pd
import os

lazada_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"

def search_value():
    print(f"Searching {os.path.basename(lazada_path)} for 'San Lazaro' and '1044.93'...")
    xl = pd.ExcelFile(lazada_path)
    
    for sheet in xl.sheet_names:
        print(f"Scanning sheet: {sheet}")
        try:
            df = xl.parse(sheet, header=None)
            
            # Convert whole dataframe to string to search
            # This is inefficient for huge data but fine here
            mask_text = df.astype(str).apply(lambda x: x.str.contains('San Lazaro', case=False, na=False))
            
            # Search for value (approximate match for floats)
            # 1,044.93 might be 1044.93 or -1044.93
            # We'll just look for the string "1044.93" first for simplicity in the 'astype(str)' version
            mask_val = df.astype(str).apply(lambda x: x.str.contains('1044.93', na=False))
            
            if mask_text.any().any():
                print(f"  FOUND 'San Lazaro' in sheet '{sheet}'")
                rows, cols = np.where(mask_text)
                for r, c in zip(rows, cols):
                    print(f"    at row {r}, col {c}: {df.iloc[r, c]}")
                    # Print surrounding context
                    start_r = max(0, r-2)
                    end_r = min(len(df), r+3)
                    print(f"    Context:\n{df.iloc[start_r:end_r].to_string()}")

            if mask_val.any().any():
                print(f"  FOUND '1044.93' in sheet '{sheet}'")
                rows, cols = np.where(mask_val)
                for r, c in zip(rows, cols):
                    print(f"    at row {r}, col {c}: {df.iloc[r, c]}")

        except Exception as e:
            print(f"  Error scanning sheet {sheet}: {e}")

if __name__ == "__main__":
    import numpy as np
    search_value()
