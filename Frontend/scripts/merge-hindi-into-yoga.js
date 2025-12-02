const fs = require("fs");
const path = require("path");

const yogaPath = path.join(__dirname, "..", "yogaExercises.json");
const hindiPath = path.join(__dirname, "..", "yogahindi.json");
const outPath = yogaPath; // overwrite same file; change if you want backup

function main() {
    const yogaRaw = fs.readFileSync(yogaPath, "utf8");
    const hindiRaw = fs.readFileSync(hindiPath, "utf8");

    const yoga = JSON.parse(yogaRaw);
    const hindi = JSON.parse(hindiRaw);

    if (yoga.length !== hindi.length) {
        console.error("Length mismatch:", { yoga: yoga.length, hindi: hindi.length });
        process.exit(1);
    }

    const merged = yoga.map((pose, idx) => ({
        ...pose,
        hindi: hindi[idx].hindi,  // add hindi translation
    }));

    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf8");
    console.log("✅ Updated", outPath, "with hindi field for each pose.");
}

main();