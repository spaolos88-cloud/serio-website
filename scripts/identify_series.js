import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to model-index.json (assuming script is in v2/scripts/)
const DATA_PATH = path.join(__dirname, '../public/data/model-index.json');

// Helper to identify series from product name
function identifySeries(name) {
    if (!name) return null;
    const cleanName = name.trim();

    // Pattern 1: Leading letters followed by hyphen (e.g. "DS-77EX" -> "DS")
    // We want at least 1 letter, followed by hyphen.
    const prefixMatch = cleanName.match(/^([A-Za-z]+)-/);
    if (prefixMatch) {
        const seriesPrefix = prefixMatch[1].toUpperCase();
        return `${seriesPrefix} Series`;
    }

    // Pattern 2: Specific known series that might have space (optional, add as needed)
    if (cleanName.startsWith("Grandioso")) return "Grandioso Series";

    // Fallback: Return null (will default to 'General' or sub-category in UI)
    return null;
}

try {
    console.log(`Reading data from ${DATA_PATH}...`);
    let rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    // Remove BOM if present (0xFEFF)
    if (rawData.charCodeAt(0) === 0xFEFF) {
        rawData = rawData.slice(1);
    }
    const products = JSON.parse(rawData);

    let updatedCount = 0;

    const enrichedProducts = products.map(product => {
        // Identify Series
        const series = identifySeries(product.name);

        // Only update if we found a series AND it's different/new
        if (series && product.series !== series) {
            product.series = series;
            updatedCount++;
        }

        return product;
    });

    if (updatedCount > 0) {
        fs.writeFileSync(DATA_PATH, JSON.stringify(enrichedProducts, null, 4), 'utf-8');
        console.log(`✅ Success! Updated ${updatedCount} products with Series tags.`);
    } else {
        console.log("No new series identifications made.");
    }

} catch (error) {
    console.error("❌ Error processing file:", error);
}
