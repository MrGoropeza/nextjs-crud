import { Field, FieldProps } from "formik";
import { Calendar, CalendarProps } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";

type DateFilterType = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "between";

const DATE_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not equals", value: "neq" },
  { label: "Greater than", value: "gt" },
  { label: "Greater than or equals", value: "gte" },
  { label: "Less than", value: "lt" },
  { label: "Less than or equals", value: "lte" },
  { label: "Between", value: "between" },
];

export interface DateFilterProps extends CalendarProps {
  field: string;
  initialType?: DateFilterType;
}

const DateFilter = ({
  field,
  initialType = "eq",
  ...rest
}: DateFilterProps) => {
  return (
    <div className="flex gap-4">
      <Field name={`${field}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={DATE_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${field}.value`}>
        {({ field }: FieldProps) => <Calendar {...rest} {...field} />}
      </Field>
    </div>
  );
};

export default DateFilter;
