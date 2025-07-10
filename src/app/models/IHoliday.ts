export interface IHoliday {
  name: string;
  date: string | Date;
}

export interface IHolidayResponse extends IHoliday {
  id: number;
}
