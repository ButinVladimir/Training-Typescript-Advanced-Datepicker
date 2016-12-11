import { IDatepickerRange, DatepickerRange } from "../datepicker-range";
import { IDatepickerRangeTypeStorage } from "../datepicker-range-type-storage";

const LOCAL_STORAGE_KEY = "datepicker-plugin";

export interface IDatepickerRangeStorage {
    dates: IDatepickerRange[];

    add(range: IDatepickerRange): void;
    clear(): void;
}

export class DatepickerRangeStorage implements IDatepickerRangeStorage {
    private _dates: IDatepickerRange[];

    constructor(private _typeStorage: IDatepickerRangeTypeStorage) {
        let serializedDates = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!serializedDates) {
            this._dates = [];
        } else {
            let savedDates: ISavedRange[] = JSON.parse(serializedDates);
            this._dates = savedDates.map((range: ISavedRange) => new DatepickerRange(new Date(range.start), new Date(range.finish), this._typeStorage.get(range.type)));
        }
    }

    public get dates(): IDatepickerRange[] {
        return this._dates;
    }

    public add(range: IDatepickerRange): void {
        this._dates.push(range);
        this.save();
    }

    public clear(): void {
        this._dates = [];
        this.save();
    }

    private save(): void {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._dates.map((range: IDatepickerRange) => {
            return { start: range.start, finish: range.finish, type: range.type.value };
        })));
    }
}

interface ISavedRange {
    start: string;
    finish: string;
    type: string;
}