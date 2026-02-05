import pandas as pd
import os

files = [
    r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\#05 Caramia May 2023.xls",
    r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"
]

for f in files:
    print(f"\n--- Inspecting {os.path.basename(f)} ---")
    try:
        if f.endswith('.xls'):
            # simple read for xls
            df = pd.read_excel(f) # might need engine='xlrd'
        else:
            df = pd.read_excel(f)
        
        print("Columns:", df.columns.tolist())
        print("Shape:", df.shape)
        print("First 5 rows:")
        print(df.head(5).to_string())
        
        if "Unnamed: 0" in df.columns[0]:
            print("\nPotential header scan (rows 20-30):")
            print(df.iloc[20:30].to_string())
    except Exception as e:
        print(f"Error reading {f}: {e}")
