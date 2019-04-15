const fs = require("fs");

/* Matches code from the description */

const rx = /^(\d+)( - )(.*)/;

/* Clean duke drg data and populate missing fields*/

function main() {
    let rawJSON = fs.readFileSync("../cleaned_json/duke_drg.csv.json")
    let data = JSON.parse(rawJSON)

    data.forEach((r) => {
        let match = rx.exec(r.drg_description);
        r.drg_code = match[1];
        r.drg_description = match[3];
        delete r.field6;
        delete r.field7;
        delete r.field8;
        delete r.field9;
        delete r.field10;
    });
    console.log(data[0]);
}

main(); 