const fs = require("fs");
//Matches code from the description
//"1 - HEART TRANSPLANT OR IMPLANT OF HEART ASSIST SYSTEM W MCC"
const rx = /^(\d+)( - )(.*)/;
/**Clean the Duke DRG Data and populate missing fields */

function main() {
    let rawJSON = fs.readFileSync("../cleaned_json/duke_drg.csv.json")
    let data = JSON.parse(rawJSON);

    data.forEach((r) => {
        let match = rx.exec(r.drg_decription);
        r.drg_code = match[1];
        r.drg_description = match[2]
    });
    console.log(data[0]);
}

main();