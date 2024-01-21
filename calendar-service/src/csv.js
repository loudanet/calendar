import { createObjectCsvWriter } from "csv-writer";
import csv from "csv-parser";
import fs from "fs";

const fp = "../calendar-service/data/events.csv";

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
    return new Promise((resolve, reject) => {
        w.writeRecords(events).
        catch((err) => { reject(err) }).
        then(() => { console.log(`Wrote ${events.length} events`); resolve(); });
    })
};

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
    });
};

export function getMaxId() {
    return new Promise((resolve, reject) => {
        let maxId = 0;
        fs.createReadStream(fp).
        pipe(csv()).
        on("data", (row) => {
            const id = Number(row.ID);
            if (id > maxId) {
                maxId = id;
            }
        }).
        on("end", () => {
            resolve(maxId);
        });
    });
}