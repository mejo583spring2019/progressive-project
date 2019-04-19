const fs = require("fs");


/** add $ signs and , */
function main() {
  if (process.argv.length < 3) {
    process.stderr.write("Please provide path to clean\n");
  }
  const filepath = process.argv[2];
  const rawJSON = fs.readFileSync(filepath);

  const data = JSON.parse(rawJSON);

  data.forEach((r) => {
    Object.keys(r).forEach((k) => {
      if (k.indexOf("price") >= 0 || k.indexOf("responsibility") >= 0) {
        let val = r[k];
        val = val.replace(",", "").replace("$", "");
        r[k] = val;
      }
    });
  });

  const finalJSON = JSON.stringify(data);
  fs.writeFileSync(filepath, finalJSON);
}
main();
