const fs = require("fs");

// Matches the code from the description
// e.g. "1 - HEART TRANSPLANT OR IMPLANT OF HEART ASSIST SYSTEM W MCC"
const rx = /^(\d+)( - )(.*)/;

/** Clean the Duke DRG data and populate missing fields. */
function main() {
  let rawJSON = fs.readFileSync("../cleaned_json/duke_drg.csv.json");
  let data = JSON.parse(rawJSON);

  data.forEach((r) => {
    let match = rx.exec(r.drg_description);
    r.drg_code = match[1];
    r.drg_description = match[3];
  });

  console.log(data[0]);
}

main();