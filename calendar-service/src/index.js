import { write, read, getMaxId, remove } from "./csv.js";
import express from "express";
import bodyparser from "body-parser";

let app = express();

// Required for parsing the HTTP request body
const plainTextParser = bodyparser.text();

app.use((req, res, next) => {
    // CORS management
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE");
    res.header("Access-Conrol-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/events", (req, res, next) => {
    read(req.query.year, req.query.month, req.query.day).
    then((events) => {
        res.send(JSON.stringify(events));
    }).
    catch((err) => { console.error(err); res.status(500).send(); })
});

app.put("/events/:year/:month/:day", plainTextParser, (req, res, next) => {
    if (!req.body) {
        res.status(400).send("Missing event 'NAME' in client request");
        return;
    }

    getMaxId().
    then((maxId) => {
        const id = maxId + 1;
        const events = [{YEAR: req.params.year, MONTH: req.params.month, DAY: req.params.day, ID: id, NAME: req.body}];
        return write(events);
    }).
    then(() => {
        res.status(201).send();
    }).
    catch((err) => {
        console.error(err);
        res.status(500).send();
    })
});

app.delete("/events/:year/:month/:day/:id", (req, res, next) => {
    remove(req.params.year, req.params.month, req.params.day, req.params.id).
    then(() => {
        res.status(201).send();
    }).
    catch((err) => {
        res.status(500).send(err);
    });
});

app.listen(8080, () => {
    console.log("Okey here we goooo!");
});