import pandas as pd
import os
import re

caramia_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\#05 Caramia May 2023.xls"
lazada_path = r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\LAZ-MAY_.xlsx"

def analyze_branches():
    print("Loading Caramia Data...")
    df_c = pd.read_excel(caramia_path)
    
    # Create lookup map: Source Document (or part of it) -> Branch
    # Source Document e.g., "Return of WH/OUT/02773"
    # We'll normalize to just the WH/OUT part if possible, or keep full string
    # Let's extract "WH/OUT/xxxxx"
    
    c_refs = {}
    
    # Helper to extract WH/OUT/xxxxx
    def extract_ref(val):
        if not isinstance(val, str): return None
        m = re.search(r'(WH/OUT/\d+)', val)
        return m.group(1) if m else None

    print("Indexing Caramia References...")
    for idx, row in df_c.iterrows():
        src = row.get('Source Document', '')
        ref = extract_ref(src)
        branch = row.get('Sales Order/Branch/Branch', 'Unknown')
        
        if ref:
            c_refs[ref] = branch
            
    print(f"Indexed {len(c_refs)} unique references from Caramia.")
    
    print("\nLoading Lazada Data...")
    xl = pd.ExcelFile(lazada_path)
    
    report_data = []
    
    for sheet in xl.sheet_names:
        # Skip probable non-data sheets if any, but better check all
        # print(f"Scanning {sheet}...")
        try:
            df = xl.parse(sheet, header=None)
            
            # Find references in this sheet
            # We'll convert to string and regex search
            sheet_content = df.astype(str).to_string()
            found_refs = re.findall(r'(WH/OUT/\d+)', sheet_content)
            found_refs = list(set(found_refs)) # unique
            
            status = "Unknown/No Refs"
            branch_match = "N/A"
            match_count = 0
            
            if found_refs:
                # Check if any exist in Caramia
                matches = [r for r in found_refs if r in c_refs]
                match_count = len(matches)
                
                if match_count > 0:
                    status = "FOUND"
                    # Pick the branch from the first match
                    branch_match = c_refs[matches[0]]
                else:
                    status = "MISSING"
            
            # Extract Total Amount if possible (heuristic)
            # Usually bottom rightish or sum of a specific column.
            # In LAZ (7), amount was col 7.
            # let's try to sum the last numeric column? Dangerous.
            # Let's just report the status for now.
            
            report_data.append({
                "Sheet": sheet,
                "Status": status,
                "Inferred Branch": branch_match,
                "Ref Count (Sheet)": len(found_refs),
                "Ref Matches (Caramia)": match_count,
                "Sample Ref": found_refs[0] if found_refs else ""
            })
            
        except Exception as e:
            print(f"Error parsing {sheet}: {e}")

    print("\n--- Analysis Report ---")
    df_rep = pd.DataFrame(report_data)
    print(df_rep.to_string())
    
    # Save report
    df_rep.to_csv(r"c:\Users\spsib\.gemini\antigravity\playground\pyro-meteorite\v2\accounting\missing_branches_report.csv", index=False)
    print("\nReport saved to missing_branches_report.csv")

if __name__ == "__main__":
    analyze_branches()
