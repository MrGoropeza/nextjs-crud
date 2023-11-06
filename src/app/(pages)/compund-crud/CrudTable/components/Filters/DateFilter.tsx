import { Field, FieldProps } from "formik";
import { Calendar, CalendarProps } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";

type DateFilterType = "lt" | "lte" | "gt" | "gte" | "between";

const DATE_FILTER_TYPES: SelectItem[] = [
  { label: "Greater than", value: "gt" },
  { label: "Greater than or equals", value: "gte" },
  { label: "Less than", value: "lt" },
  { label: "Less than or equals", value: "lte" },
  { label: "Between", value: "between" },
];

export interface DateFilterProps extends Omit<CalendarProps, "selectionMode"> {
  field: string;
  label: string;
  initialType?: DateFilterType;
}

const DateFilter = ({
  field: fieldName,
  label,
  initialType = "lt",
  ...rest
}: DateFilterProps) => {
  return (
    <div className="grid-cols[auto_1fr] grid gap-x-4 gap-y-2">
      <label className="col-span-2" htmlFor={`${fieldName}.value`}>
        {label}
      </label>

      <Field name={`${fieldName}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={DATE_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${fieldName}.value`}>
        {({ field, form }: FieldProps) => (
          <Calendar
            {...rest}
            selectionMode={
              form.values[fieldName].type === "between" ? "range" : "single"
            }
            {...field}
            onChange={(e) => {
              form.setFieldValue(field.name, e.value);

              if (
                form.values[fieldName].type === "between" &&
                e.value instanceof Array
              ) {
                form.setFieldValue(`${fieldName}.from`, e.value[0]);
                form.setFieldValue(`${fieldName}.to`, e.value[1]);
              }
            }}
          />
        )}
      </Field>
    </div>
  );
};

export default DateFilter;
