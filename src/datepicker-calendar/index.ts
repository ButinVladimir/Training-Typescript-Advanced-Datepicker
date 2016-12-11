import { IDatepickerRangeTypeStorage } from "../datepicker-range-type-storage";
import { IDatepickerRangeStorage } from "../datepicker-range-storage";
import { IDatepickerRange } from "../datepicker-range";
import * as $ from "jquery";

const MONTHS_NAMES: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface IDatepickerCalendarSelectEvent extends CustomEvent {
    year: number;
    month: number;
    day: number;
}

export interface IDatepickerCalendar {
    render(): void;
    registerHandlers(): void;
    prevMonth(): void;
    nextMonth(): void;
}

export class DatepickerCalendar implements IDatepickerCalendar {
    private _$caption: JQuery;
    private _$days: JQuery;
    private _$prevBtn: JQuery;
    private _$nextBtn: JQuery;

    private _year: number;
    private _month: number;

    private _todayYear: number;
    private _todayMonth: number;
    private _todayDay: number;

    constructor(private _rangeStorage: IDatepickerRangeStorage,
                private _typeStorage: IDatepickerRangeTypeStorage,
                private _selectedRange: IDatepickerRange,
                private _$calendarBlock: JQuery) {
        this._$caption = this._$calendarBlock.find(".datepicker-month-caption");
        this._$days = this._$calendarBlock.find(".datepicker-days-table tbody");
        this._$prevBtn = this._$calendarBlock.find(".datepicker-prev-month-button");
        this._$nextBtn = this._$calendarBlock.find(".datepicker-next-month-button");

        let todayDate = new Date();
        this._year = todayDate.getFullYear();
        this._month = todayDate.getMonth();

        this._todayYear = todayDate.getFullYear();
        this._todayMonth = todayDate.getMonth();
        this._todayDay = todayDate.getDate();
    }

    public render(): void {
        this._$caption.html(MONTHS_NAMES[this._month] + " " + this._year);
        this._$days.empty();

        let $row: JQuery = $("<tr>"),
            dayOfWeek: number = (new Date(this._year, this._month, 1)).getDay(),
            daysInMonth = (new Date(this._year, this._month + 1, 0)).getDate();

        for (let offset: number = 0; offset < dayOfWeek; offset++) {
            $row.append(this.renderEmptyDayCell());
        }

        for (let day: number = 1; day <= daysInMonth; day++) {
            $row.append(this.renderDayCell(day));

            dayOfWeek++;
            if (dayOfWeek === 7) {
                dayOfWeek = 0;
                this._$days.append($row);

                if (day !== daysInMonth) {
                    $row = $("<tr>");
                }
            }
        }

        if (dayOfWeek > 0) {
            for (let offset: number = dayOfWeek; offset < 7; offset++) {
                $row.append(this.renderEmptyDayCell());
            }
            this._$days.append($row);
        }
    }

    public registerHandlers(): void {
        let self: DatepickerCalendar = this;

        this._$prevBtn.click(() => this.prevMonth());
        this._$nextBtn.click(() => this.nextMonth());
        this._$days.on("click", "a", function(e: JQueryEventObject) {
            e.preventDefault();

            self._$calendarBlock.trigger("datepicker.calendar.select", {
                year: self._year,
                month: self._month,
                day: $(this).data("day")
            });
        });
    }

    public prevMonth(): void {
        this._month--;
        if (this._month < 0) {
            this._month = 11;
            this._year--;
        }

        this.render();
    }

    public nextMonth(): void {
        this._month++;
        if (this._month > 11) {
            this._month = 0;
            this._year++;
        }

        this.render();
    }

    private renderEmptyDayCell(): JQuery {
        return $("<td></td>");
    }

    private isToday(day: number): boolean {
        return this._year === this._todayYear && this._month === this._todayMonth && day === this._todayDay;
    }

    private isInRange(day: number, range: IDatepickerRange): boolean {
        let date = new Date(this._year, this._month, day);

        return date.getTime() >= range.start.getTime() && date.getTime() <= range.finish.getTime();
    }

    private isMarked(day: number, range: IDatepickerRange): boolean {
        let date = new Date(this._year, this._month, day);

        return date.getTime() === range.start.getTime() || date.getTime() === range.finish.getTime();
    }

    private renderDayCell(day: number): JQuery {
        let $cell: JQuery = $("<td>"),
            $link: JQuery = $("<a>" , {href: "#", "data-day": day, text: day});

        if (this.isToday(day)) {
            $link.addClass("today");
        }

        this._rangeStorage.dates.forEach((range: IDatepickerRange) => {
            if (this.isInRange(day, range)) {
                $link.addClass(range.type.class);
            }
        });

        if (this.isMarked(day, this._selectedRange)) {
            $link.addClass("marked");
        }

        if (this.isInRange(day, this._selectedRange)) {
            $link.addClass("selected");
        }

        $cell.append($link);
        return $cell;
    }
}
