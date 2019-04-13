const fs = require("fs");
//Matches code from the description. e. g. 1 - HEART TRANSPLANT OR IMPLANT OF HEART ASSIST SYSTEM W MCC
const rx = /^(\d+)( - )(.*)/;
// clean the Duke DRG data and populate missing fields
function main() {
    let rawJSON = fs.readFileSync("../cleaned_json/duke_drg.csv.json");
    let data = JSON.parse(rawJSON);

    data.forEach(r => {
        let match = rx.exec(r.drg_description);
        if (match) {
        r.drg_code = match[1];
        r.drg_description = match[3];
        }
        if (r.insured_average_patient_responsibility === "-") {
            r.insured_average_patient_responsibility = "0";
        }
        if (r.uninsured_average_patient_responsibility === "-") {
            r.uninsured_average_patient_responsibility = "0";
        }
        delete r.field6;
        delete r.field7;
        delete r.field8;
        delete r.field9;
        delete r.field10;
        Object.keys(r).forEach((k) => {
            let val = r[k];
            val = val.trim();
            r[k] = val;
        })
    });
    let finalJSON = JSON.stringify(data);
    fs.writeFileSync("../cleaned_json/duke_drg.csv.json", finalJSON);
}

main();