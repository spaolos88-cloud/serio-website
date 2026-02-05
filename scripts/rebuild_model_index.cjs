const fs = require('fs');
const path = require('path');

const CATALOG_DIR = path.join(__dirname, '../public/data/catalog');
const INDEX_OUTPUT = path.join(__dirname, '../public/data/model-index.json');

function main() {
    console.log(`Scanning ${CATALOG_DIR}...`);

    if (!fs.existsSync(CATALOG_DIR)) {
        console.error("Catalog directory not found!");
        process.exit(1);
    }

    const files = fs.readdirSync(CATALOG_DIR).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} catalog files.`);

    const indexMap = new Map();

    for (const file of files) {
        // console.log(`Processing ${file}...`);
        if (file === 'diatone.json') console.log('DEBUG: Found diatone.json');
        const filePath = path.join(CATALOG_DIR, file);
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            // Strip BOM
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            const data = JSON.parse(content);

            // Handle array of products in one file (like diatone.json)
            const products = Array.isArray(data) ? data : [data];

            if (file === 'diatone.json') console.log(`DEBUG: diatone.json has ${products.length} products.`);

            for (const p of products) {
                // Extract Performance Class
                let perfClass = null;
                if (p.serio_taxonomy && p.serio_taxonomy.performance_class) {
                    const rawClass = p.serio_taxonomy.performance_class;
                    // Normalize: "Class A+" -> "A", "Class S" -> "S", "S" -> "S"
                    // Match the first letter after "Class" or just the first letter if no "Class" prefix
                    const match = rawClass.match(/([SAB])/i);
                    if (match) {
                        perfClass = match[1].toUpperCase();
                    } else if (rawClass.toUpperCase().includes('LEGEND')) {
                        perfClass = 'LEGEND';
                    }
                }

                // Tuning Profile
                let tuning = null;
                if (p.serio_taxonomy && p.serio_taxonomy.tuning_profile) {
                    tuning = p.serio_taxonomy.tuning_profile;
                }

                const entry = {
                    id: p.id,
                    category: p.category,
                    sub_category: p.sub_category || '',
                    name: p.name,
                    brandId: p.brandId,
                    class: perfClass, // This is the key fix
                    verified: p.verified || false,
                    image_url: p.image_url || null,
                    release_year: p.release_year,
                    tuning_profile: tuning,
                    tags: p.tags || [],
                    description: p.description ? p.description.slice(0, 200) : null // Snippet
                };

                // Deduplicate by ID
                if (indexMap.has(entry.id)) {
                    // Merge strategy: Keep existing unless new one has better data
                    const existing = indexMap.get(entry.id);
                    // Prefer non-null class
                    if (!existing.class && entry.class) existing.class = entry.class;
                    // Prefer non-null image
                    if (!existing.image_url && entry.image_url) existing.image_url = entry.image_url;
                    // Prefer longer description
                    if ((!existing.description || existing.description.length < (entry.description || '').length) && entry.description) {
                        existing.description = entry.description;
                    }
                } else {
                    indexMap.set(entry.id, entry);
                }
            }

        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }

    const index = Array.from(indexMap.values());
    console.log(`Writing ${index.length} entries to ${INDEX_OUTPUT}...`);
    fs.writeFileSync(INDEX_OUTPUT, JSON.stringify(index, null, 4));
    console.log("Done.");
}

main();
