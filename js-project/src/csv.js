import { createObjectCsvWriter } from "csv-writer";
import csv from "csv-parser";
import fs from "fs";

const fp = "../js-project/data/events.csv";

const w = createObjectCsvWriter({
    path: fp,
    header: [
        {id: "year", name: "YEAR"},
        {id: "month", name: "MONTH"},
        {id: "day", name: "DAY"},
        {id: "id", name: "ID"},
        {id: "name", name: "NAME"}
    ],
    append: true
});

export function write(events) {
    var statusCode;
    w.writeRecords(events).
    catch((err) => { console.error(err); var statusCode = 500; }).
    then(() => { console.log(`Wrote ${events.length} events`); var statusCode = 201; })
    return statusCode;
}

export function read(year, month, day) {
    return new Promise((resolve, reject) => {
        let events = [];
        fs.createReadStream(fp).
        pipe(csv()).
        on("data", (row) => {
            if (row.YEAR == year && row.MONTH == month && row.DAY == day) {
                events.push(row.NAME);
            }
        }).
        on("end", () => {
            resolve(events);
        });
    })
}