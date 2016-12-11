export interface IDatepickerRangeType {
    value: string;
    class: string;
    description: string;
}

export class DatepickerRangeType implements IDatepickerRangeType {
    constructor(private _value: string,
                private _class: string,
                private _description: string
        ) {
    }

    public get value(): string {
        return this._value;
    }

    public get class(): string {
        return this._class;
    }

    public get description(): string {
        return this._description;
    }
}
