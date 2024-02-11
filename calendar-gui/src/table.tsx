import CalendarDate from "./date";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type TableRow = {
    YEAR: string;
    MONTH: string;
    DAY: string;
    NAME: string;
    ID: number;
};

const calendarUrl: string = "http://localhost:8080/events";

library.add(faTrash);
const iconHTML = icon({
    prefix: "fas", // The prefix for solid icons
    iconName: "trash" // The name of the icon
  }).html[0];

function getHtmlTable(events: TableRow[], date: CalendarDate): HTMLTableElement {
    let t: HTMLTableElement = document.createElement("table");
    
    let header: HTMLTableSectionElement = t.createTHead();
    let headerRow: HTMLTableRowElement = header.insertRow(0);

    let t0: HTMLTableCellElement = headerRow.insertCell(0);
    let t1: HTMLTableCellElement = headerRow.insertCell(1);
    let t2: HTMLTableCellElement = headerRow.insertCell(2);
    let t3: HTMLTableCellElement = headerRow.insertCell(3);
    let t4: HTMLTableCellElement = headerRow.insertCell(4);
    
    t0.innerText = "YEAR";
    t1.innerText = "MONTH";
    t2.innerText = "DAY";
    t3.innerText = "EVENT";
    t4.innerText = "DELETE";

    let body: HTMLTableSectionElement = t.createTBody();
    for (let i = 0; i < events.length; i++) {
        let ev: TableRow = events[i];
        let r: HTMLTableRowElement = body.insertRow(-1);

        let y: HTMLTableCellElement = r.insertCell(0);
        let m: HTMLTableCellElement = r.insertCell(1);
        let d: HTMLTableCellElement = r.insertCell(2);
        let e: HTMLTableCellElement = r.insertCell(3);
        let del: HTMLTableCellElement = r.insertCell(4);

        y.innerText = ev.YEAR;
        m.innerText = ev.MONTH;
        d.innerText = ev.DAY;
        e.innerText = ev.NAME;
        del.innerHTML = `<button>${iconHTML}</button>`;
        del.addEventListener("click", () => {
            removeEvent(ev.ID, date);
        });
    }
    
    return t;
};

function removeEvent(id: number, d: CalendarDate): void {
    const http = new XMLHttpRequest();
    const url: string = calendarUrl + `/${d.year}/${d.month}/${d.day}/${id}`;
    http.open("DELETE", url, true);
    http.send();
    // TODO: Refresh for date d
}

export function refresh(date: CalendarDate): void {
    const http = new XMLHttpRequest();
    const url: string = calendarUrl + `?year=${date.year}&month=${date.month}&day=${date.day}`;
    http.open("GET", url, true);
    http.onreadystatechange = function() {
        let r: HTMLElement = document.getElementById("response") as HTMLElement;
        switch (this.readyState) {
            case 2:
            case 3:
                r.innerHTML = "<p>Loading...</p>";
                break;
            case 4:
                setTimeout(() => {
                    let resp: TableRow[] = JSON.parse(this.response);
                    let htmlTable: HTMLTableElement = getHtmlTable(resp, date);
                    r.innerHTML = "";
                    r.appendChild(htmlTable);
                }, 500);
        }
    }
    http.send();
}
