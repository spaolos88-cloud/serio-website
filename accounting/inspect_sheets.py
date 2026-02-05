import pandas as pd
import os

files = [
    r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\#05 Caramia May 2023.xls",
    r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"
]

for f in files:
    if "LAZ-MAY" not in f: continue
    
    try:
        xl = pd.ExcelFile(f)
        
        print(f"\n--- Inspecting {os.path.basename(f)} - Sheet: LAZ (7) Top Rows ---")
        df = xl.parse("LAZ (7)", header=None)
        print(df.iloc[0:20].to_string())
        
        print(f"\n--- Inspecting {os.path.basename(f)} - Sheet: Sheet1 ---")
        df_summary = xl.parse("Sheet1", header=None)
        print(df_summary.iloc[0:30].to_string())
        
    except Exception as e:
        print(f"Error reading {f}: {e}")
