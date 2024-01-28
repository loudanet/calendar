import { useState } from "react";
import CalendarDate, { CalendarDateFromString } from "./date";
import { refresh } from "./table";
import ErrorBoundary from "./error-boundary";
import "./styles.css"

const calendarUrl: string = "http://localhost:8080/events";

export function App() {
    // TODO: Use fewer variables (less error-prone and easier to follow)
    let [calendarDate, setCalendarDate] = useState(new CalendarDate());
    let [inputDate, setInputDate] = useState(calendarDate.toString());
    let [inputDateColour, setInputDateColour] = useState("black");
    let [inputEvent, setInputEvent] = useState("Event")
    let [inputEventColour, setInputEventColour] = useState("gray");
    let [clicked, setClicked] = useState(false);

    function updateInputDate(d: string): void {
        setInputDate(d);
        let [date, ok] = CalendarDateFromString(d);
        if (ok) {
            setInputDateColour("black");
            setCalendarDate(date);
            refresh(date);
        } else {
            setInputDateColour("red");
        }
    }

    function handleEventChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setInputEventColour("black");
        setInputEvent(event.target.value);
    }

    function handleInputEventClick(): void {
        if (!clicked) {
            setInputEvent("")
        }
        setClicked(true);
    }

    function handleEventSubmission(): void {
        const http = new XMLHttpRequest();
        const url = calendarUrl + `/${calendarDate.year}/${calendarDate.month}/${calendarDate.day}`;
        http.open("PUT", url, true);
        http.onreadystatechange = function() {
            let r: HTMLElement = document.getElementById("response") as HTMLElement;
            switch (this.readyState) {
                case 2:
                case 3:
                    r.innerHTML = "<p>Loading...</p>";
                    break;
                case 4:
                    setInputEvent("");
                    refresh(calendarDate);
            }
        }
        http.setRequestHeader("Content-Type", "text/plain");
        http.send(inputEvent);
    }

    return (
        <div>
            <ErrorBoundary>
                <div id="form">
                    <button className="left" onClick={() => { updateInputDate(calendarDate.prevDay().toString()) }}>T-1</button>
                    <button className="left" onClick={() => { updateInputDate(new CalendarDate().toString()) }}>T0</button>
                    <button className="left" onClick={() => { updateInputDate(calendarDate.nextDay().toString()) }}>T+1</button>
                    <input id="inputDate" name="Date" type="text" style={{color: inputDateColour}} value={inputDate} onChange={(e) => { updateInputDate(e.target.value) }}></input>
                    <input id="inputEvent" name="Event" type="text" style={{color: inputEventColour}} value={inputEvent} onClick={handleInputEventClick} onChange={handleEventChange}></input>
                    <button className="right" onClick={handleEventSubmission}>Insert</button>
                    <button className="right" onClick={() => {refresh(calendarDate)}}>Refresh</button>
                </div>
                <div className="background">
                    <div id="response">
                        Welcome!
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    )
}
