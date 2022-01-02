export interface ICalender {
  placeholder?: string;
  dateValue?: string;
  EditDate?: string | null;
  onDate?: (value: string) => void;
}
