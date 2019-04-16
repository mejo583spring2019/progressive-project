const fs = require("fs");

/** Replaces dollar signs and commas in prices */
function main() {
    // console.log(process.argv);
    if (process.argv.length < 3) {
        process.stderr.write("Please provide the path to file to clean.\n")
    }
    let filepath = process.argv[2];
    let rawJSON = fs.readFileSync(filepath);

    let data = JSON.parse(rawJSON);
    data.forEach((r) => {
        Object.keys(r).forEach(k => {
            if (k.indexOf("price") >= 0 || k.indexOf("responsibility") >= 0) {
                let val = r[k];
                val = val.replace(',', '').replace('$', '')
                r[k] = val;
            }
        });
    });
    let finalJSON = JSON.stringify(data);
    fs.writeFileSync(filepath, finalJSON);


}

main();