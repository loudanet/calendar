import { createObjectCsvWriter } from "csv-writer";
import csv from "csv-parser";
import fs from "fs";

const fp = "../calendar-service/data/events.csv";

const w = createObjectCsvWriter({
    path: fp,
    header: [
        {id: "YEAR", name: "YEAR"},
        {id: "MONTH", name: "MONTH"},
        {id: "DAY", name: "DAY"},
        {id: "ID", name: "ID"},
        {id: "NAME", name: "NAME"}
    ],
    append: true
});

export function write(events) {
    if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, "YEAR,MONTH,DAY,ID,NAME\n")
    }

    return new Promise((resolve, reject) => {
        let newEvents = [];
        for (let i = 0; i < events.length; i++) {
            newEvents.push({
                YEAR: events[i].YEAR,
                MONTH: events[i].MONTH,
                DAY: events[i].DAY,
                ID: events[i].ID,
                NAME: events[i].NAME,
            })
        }
        w.writeRecords(newEvents).
        catch((err) => { reject(err) }).
        then(() => { resolve(); });
    })
};

export function read(year, month, day) {
    return new Promise((resolve, reject) => {
        let events = [];
        fs.createReadStream(fp).
        pipe(csv()).
        on("data", (row) => {
            if (row.YEAR != year) {
                return;
            }
            if (row.MONTH != month) {
                return;
            }
            if (row.DAY != day) {
                return;
            }
            events.push(row);
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

export function remove(year, month, day, id) {
    return new Promise((resolve, reject) => {
        read(year, month, day).
        then((events) => {
            let newEvents = [];
            let found = false;
            for (let i = 0; i < events.length; i++) {
                let ev = events[i];
                if (ev.ID == id) {
                    found = true;
                    continue;
                }
                newEvents.push(ev);
            }
            if (!found) {
                throw(`Event with ID ${id} not found`);
            }
            return newEvents;
        }).then((events) => {
            fs.unlinkSync(fp);
            write(events);
        }).catch((err) => {
            console.error(err);
        });
    });
}