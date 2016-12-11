import * as $ from "jquery";
import { IDatepickerRangeType, DatepickerRangeType} from "./datepicker-range-type";
import { IDatepickerRangeTypeStorage, DatepickerRangeTypeStorage } from "./datepicker-range-type-storage";
import { IDatepickerRangeStorage, DatepickerRangeStorage } from "./datepicker-range-storage";
import { IDatepicker, Datepicker } from "./datepicker";

$(() => {
    let datepickerRangeTypeStorage: IDatepickerRangeTypeStorage = new DatepickerRangeTypeStorage();

    [
        new DatepickerRangeType("1", "range-1", "Reminder"),
        new DatepickerRangeType("2", "range-2", "Meeting"),
        new DatepickerRangeType("3", "range-3", "Appointment"),
    ].forEach(function(v: IDatepickerRangeType) {
        datepickerRangeTypeStorage.add(v);
    });

    let datepickerRangeStorage: IDatepickerRangeStorage = new DatepickerRangeStorage(datepickerRangeTypeStorage);

    let datepicker: IDatepicker = new Datepicker(datepickerRangeStorage, datepickerRangeTypeStorage);

    $.fn.datepicker = function() {
        $(this).each(function() {
            $(this).on("datepicker.show", (eventObject: JQueryEventObject, posX: string, posY: string) => {
                datepicker.showWindow(posX, posY);
            });
        });

        return this;
    };


    /*
     * Usage
     */
    (<any> $("#target")).datepicker().click(function(e: CustomEvent) {
        e.stopPropagation();

        $(this).trigger("datepicker.show", {posX: "200px", posY: "200px"});
    });
});
