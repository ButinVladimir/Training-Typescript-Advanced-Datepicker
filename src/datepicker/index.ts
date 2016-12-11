import { IDatepickerRangeTypeStorage } from "../datepicker-range-type-storage";
import { IDatepickerRangeStorage } from "../datepicker-range-storage";
import { IDatepickerCalendar, DatepickerCalendar, IDatepickerCalendarSelectEvent } from "../datepicker-calendar";
import { IDatepickerRange, DatepickerRange } from "../datepicker-range";
import { IDatepickerRangeType } from "../datepicker-range-type";

import * as $ from "jquery";

const HIDE_TIME = 2000;
const TEMPLATE = require("./template.html");
const TYPE_TEMPLATE = require("./template-type.html");
require("./style.css");

export interface IDatepicker {
    showWindow(posX: string, posY: string): void;
    hideWindow(): void;
}

export class Datepicker implements IDatepicker {
    private _$window: JQuery;

    private _startCalendar: IDatepickerCalendar;
    private _$startCalendar: JQuery;
    private _finishCalendar: IDatepickerCalendar;
    private _$finishCalendar: JQuery;

    private _$typesBlock: JQuery;
    private _$addBtn: JQuery;
    private _$clearBtn: JQuery;

    private _$success: JQuery;
    private _$cleared: JQuery;
    private _$warning: JQuery;
    private _$override: JQuery;
    private _$intersect: JQuery;

    private _selectedRange: IDatepickerRange;

    constructor(private _rangeStorage: IDatepickerRangeStorage,
                private _typeStorage: IDatepickerRangeTypeStorage) {
        this._selectedRange = new DatepickerRange(new Date(), new Date(), this._typeStorage.first);
    }

    public showWindow(posX: string, posY: string): void {
        if (!this._$window) {
            this.renderWindow();
            this.registerHandlers();
        }

        this._$window.css("left", posX);
        this._$window.css("top", posY);
        this._$window.show();
    }

    public hideWindow(): void {
        if (this._$window) {
            this._$window.hide();
        }
    };

    private renderWindow(): void {
        this._$window = $("<div class=\"datepicker-window\"></div>");
        this._$window.html(TEMPLATE);

        this.renderTypes();

        this._$success = this._$window.find(".datepicker-success");
        this._$cleared = this._$window.find(".datepicker-cleared");
        this._$intersect = this._$window.find(".datepicker-intersect");
        this._$override = this._$window.find(".datepicker-override input");

        this._$startCalendar = this._$window.find(".datepicker-calendar-start");
        this._startCalendar = new DatepickerCalendar(this._rangeStorage, this._typeStorage, this._selectedRange, this._$startCalendar);
        this._$finishCalendar = this._$window.find(".datepicker-calendar-finish");
        this._finishCalendar = new DatepickerCalendar(this._rangeStorage, this._typeStorage, this._selectedRange, this._$finishCalendar);
        this.renderCalendars();

        this._$addBtn = this._$window.find(".datepicker-btn-add");
        this._$clearBtn = this._$window.find(".datepicker-btn-clear");

        $("body").append(this._$window);
    }

    private renderTypes(): void {
        this._$typesBlock = this._$window.find(".datepicker-options");

        this._typeStorage.iterate((type: IDatepickerRangeType) => {
            let row = $(TYPE_TEMPLATE),
                $input = row.find("input");

            $input.data("type", type.value);

            if (type === this._selectedRange.type) {
                $input.prop("checked", true);
            }
            row.find(".datepicker-type-text").html(type.description);

            this._$typesBlock.append(row);
        });
    }

    private renderCalendars(): void {
        this._startCalendar.render();
        this._finishCalendar.render();

        this._$intersect.toggle(this.isSelectedRangeIntersect());
    }

    private registerHandlers(): void {
        let self = this;

        $(document).click(() => { this.hideWindow(); });
        this._$window.click((e: CustomEvent) => { e.stopPropagation(); });

        this._startCalendar.registerHandlers();
        this._finishCalendar.registerHandlers();

        this._$startCalendar.on("datepicker.calendar.select", (e: JQueryEventObject, args: IDatepickerCalendarSelectEvent) => {
            this._selectedRange.start.setFullYear(args.year, args.month, args.day);
            this.renderCalendars();
        });
        this._$finishCalendar.on("datepicker.calendar.select", (e: JQueryEventObject, args: IDatepickerCalendarSelectEvent) => {
            this._selectedRange.finish.setFullYear(args.year, args.month, args.day);
            this.renderCalendars();
        });

        this._$addBtn.click((e: CustomEvent) => {
            if (this._selectedRange.start.getTime() > this._selectedRange.finish.getTime()) {
                return;
            }

            if (this._$override.prop("checked") === true || !this.isSelectedRangeIntersect()) {
                let resultRange = new DatepickerRange(
                    new Date(this._selectedRange.start.getTime()),
                    new Date(this._selectedRange.finish.getTime()),
                    this._selectedRange.type
                );

                this._rangeStorage.add(resultRange);
                this.renderCalendars();

                this._$success.show();
                this._$success.hide(HIDE_TIME);
            }
        });

        this._$clearBtn.click((e: CustomEvent) => {
            this._rangeStorage.clear();
            this.renderCalendars();

            this._$cleared.show();
            this._$cleared.hide(HIDE_TIME);
        });

        this._$typesBlock.on("change", "input", function() {
            self._selectedRange.type = self._typeStorage.get($(this).data("type"));
        });
    }

    private isSelectedRangeIntersect(): boolean {
        return this._rangeStorage.dates.some((range: IDatepickerRange) => this._selectedRange.isIntersect(range));
    }
}
