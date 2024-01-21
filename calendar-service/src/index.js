import { write, read } from "./csv.js";
import express from "express";
import bodyparser from "body-parser";

let app = express();

const plainTextParser = bodyparser.text();

app.use((req, res, next) => {
    // CORS management
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, PUT");
    res.header("Access-Conrol-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/events/:year/:month/:day", (req, res, next) => {
    read(req.params.year, req.params.month, req.params.day).
    then((events) => {
        if (events.length == 0) {
            res.send(`<p>Yikes - no events on that day - oh well! :(</p>`);
            return;
        }
    
        let out;
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            out = `<p>There is an event called "${event}"</p>`;
        }
        res.send(out);
    }).
    catch((err) => { console.error(err); res.status(500).send(); })
});

app.put("/events/:year/:month/:day", plainTextParser, (req, res, next) => {
    if (!req.body) {
        res.status(400).send("Missing event 'name' in client request");
        return;
    }

    const events = [{year: req.params.year, month: req.params.month, day: req.params.day, id: 999, name: req.body}]
    let statusCode = write(events);
    res.send(`Status code is ${statusCode}`);
})

app.listen(8080, () => {
    console.log("Okey here we goooo!");
});