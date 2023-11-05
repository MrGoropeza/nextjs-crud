import { Field, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

type BooleanFilterType = "eq" | "neq";

const BOOLEAN_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
];

export interface BooleanFilterProps
  extends Omit<
    TriStateCheckbox,
    | "focus"
    | "getElement"
    | "props"
    | "context"
    | "setState"
    | "forceUpdate"
    | "render"
    | "state"
    | "refs"
  > {
  field: string;
  label: string;
  initialType?: BooleanFilterType;
}

const BooleanFilter = ({ field, label, ...rest }: BooleanFilterProps) => {
  return (
    <div className="grid-cols[auto_1fr] grid gap-x-4 gap-y-2">
      <label className="col-span-2" htmlFor={`${field}.value`}>
        {label}
      </label>
      <Field name={`${field}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={BOOLEAN_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${field}.value`}>
        {({ field }: FieldProps) => (
          <TriStateCheckbox
            {...rest}
            id={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      </Field>
    </div>
  );
};

export default BooleanFilter;
