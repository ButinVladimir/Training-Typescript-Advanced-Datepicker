import { IDatepickerRangeType } from "../datepicker-range-type";

type RangeTypeIteratorCallback = (value: IDatepickerRangeType) => void;

export interface IDatepickerRangeTypeStorage {
    first: IDatepickerRangeType;

    add(type: IDatepickerRangeType): void;
    get(value: string): IDatepickerRangeType;
    iterate(callback: RangeTypeIteratorCallback): void;
}

export class DatepickerRangeTypeStorage implements IDatepickerRangeTypeStorage {
    private _types: any;
    private _first: IDatepickerRangeType;

    constructor() {
        this._types = Object.create(null);
    }

    public add(type: IDatepickerRangeType): void {
        this._types[type.value] = type;

        if (!this._first) {
            this._first = type;
        }
    }

    public get(value: string): IDatepickerRangeType {
        if (!(value in this._types)) {
            throw new Error("Missing date range type");
        }

        return this._types[value];
    }

    public iterate(callback: RangeTypeIteratorCallback): void {
        for (let value in this._types) {
            callback(this._types[value]);
        }
    }

    public get first(): IDatepickerRangeType {
        return this._first;
    }
}
