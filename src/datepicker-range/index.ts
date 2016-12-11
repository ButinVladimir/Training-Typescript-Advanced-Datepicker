import { IDatepickerRangeType } from "../datepicker-range-type";

export interface IDatepickerRange {
    start: Date;
    finish: Date;
    type: IDatepickerRangeType;
    isIntersect(range: IDatepickerRange): boolean;
}

export class DatepickerRange implements IDatepickerRange {
    constructor(private _start: Date,
                private _finish: Date,
                public type: IDatepickerRangeType) {
        this._start.setHours(0, 0, 0, 0);
        this._finish.setHours(0, 0, 0, 0);
    }

    public get start(): Date {
        return this._start;
    }

    public get finish(): Date {
        return this._finish;
    }

    public isIntersect(range: IDatepickerRange): boolean {
        let left = this._start.getTime();
        let right = this._finish.getTime();

        left = Math.max(left, range.start.getTime());
        right = Math.min(right, range.finish.getTime());

        return right >= left;
    }
}
