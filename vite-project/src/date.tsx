type MonthInfo = {name: string, numDays: number}

var Months: MonthInfo[] = [
    {name: "Jan", numDays: 31},
    {name: "Feb", numDays: 29},
    {name: "Mar", numDays: 31},
    {name: "Apr", numDays: 30},
    {name: "May", numDays: 31},
    {name: "Jun", numDays: 30},
    {name: "Jul", numDays: 31},
    {name: "Aug", numDays: 31},
    {name: "Sep", numDays: 30},
    {name: "Oct", numDays: 31},
    {name: "Nov", numDays: 30},
    {name: "Dec", numDays: 31},
]

class CalendarDate {
    private _year: number;
    private _month:number;
    private _day: number;
    
    constructor(input?: [number, number, number]) {
        if (input) {
            this._year = input[0];
            this._month = input[1];
            this._day = input[2];
        } else {
            let defaultDate = new Date();
            this._year = defaultDate.getFullYear();
            this._month = defaultDate.getMonth() + 1;
            this._day = defaultDate.getDate();
        }
    }

    get year(): string {
        return this._year.toString()
    }

    get month(): string {
        if (this._month > 12 || this._month < 1) {
            throw new Error(`Invalid month ${this._month}`)
        }
        return Months[this._month - 1].name
    }

    get day(): string {
        return this._day.toString()
    }

    toString(): string {
        return this.day + " " + this.month + " " + this._year
    }

    nextDay(): CalendarDate {
        let date = new CalendarDate([this._year, this._month, this._day]);
        
        if (date._month > 12 || date._month < 1) {
            throw new Error(`Invalid month ${date._month}`);
        }
        let monthInfo: MonthInfo = Months[date._month - 1]

        switch (true) {
            case (date._day < monthInfo.numDays):
                date._day += 1;
                break;
            case (date._month < 12):
                date._month += 1;
                date._day = 1;
                break;
            default:
                date._year += 1;
                date._month = 1;
                date._day = 1;
        }
        return date;
    }

    prevDay(): CalendarDate {
        let date = new CalendarDate([this._year, this._month, this._day]);

        switch (true) {
            case (date._day > 1):
                date._day -= 1;
                break;
            case (date._month > 1):
                let prevMonthInfo: MonthInfo = Months[date._month - 2]
                date._month -= 1;
                date._day = prevMonthInfo.numDays;
                break;
            default:
                date._year -= 1;
                date._month = 12;
                date._day = 31;
        }
        return date;
    }
}

export function CalendarDateFromString(input: string): [CalendarDate, boolean] {
    let components: string[] = input.split(" ");
    if (components.length != 3) {
        return [new CalendarDate(), false]
    }

    let year: number = parseInt(components[2]);
    if (year < 1900 || year > 2100) {
        return [new CalendarDate(), false];
    }

    let day: number = parseInt(components[0]);
    if (day < 0) {
        return [new CalendarDate(), false]
    }

    for (let i: number = 0; i < Months.length; i++) {
        let monthInfo: MonthInfo = Months[i];
        if (components[1].toLowerCase() != monthInfo.name.toLowerCase()) {
            continue
        }
        if (day > monthInfo.numDays) {
            return [new CalendarDate(), false]
        }
        let month: number = i + 1;
        return [new CalendarDate([year, month, day]), true];
    }

    return [new CalendarDate(), false]
}

export default CalendarDate;