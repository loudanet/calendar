import { write, read } from "./csv.js";
import express from "express";

let app = express();

app.get("/events/:year/:month/:day", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Conrol-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    read(req.params.year, req.params.month, req.params.day).
    then((events) => {
        if (events.length == 0) {
            res.send(`<p>Yikes - no events on that day - oh well! :(</p>`);
            return;
        }
    
        let out;
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            out += `<p>There is an event called "${event}"</p>`;
        }
        res.send(out);
    }).
    catch((err) => { console.error(err); res.status(500).send(); })
});

app.put("events/:year/:month/:day", (req, res, next) => {
    if (!req.body) {
        res.status(404).send("Missing event 'name' - please specify");
    }

    const events = [{year: req.params.year, month: req.params.month, day: req.params.day, id: 999, name: req.body}]
    let statusCode = write(events);
    res.send(`Status code is ${statusCode}`);
})

app.listen(8080, () => {
    console.log("Okey here we goooo!");
});