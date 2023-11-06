"use client";

import { Field, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputText, InputTextProps } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";

type FilterType = "like" | "startswith" | "endswith" | "eq" | "neq";

const TEXT_FILTER_TYPES: SelectItem[] = [
  {
    label: "Contains",
    value: "like",
  },
  {
    label: "Starts with",
    value: "startswith",
  },
  {
    label: "Ends with",
    value: "endswith",
  },
  {
    label: "Equals",
    value: "eq",
  },
  {
    label: "Not equals",
    value: "neq",
  },
];

export interface TextFilterProps extends InputTextProps {
  field: string;
  label: string;
  initialType?: FilterType;
}

const TextFilter = ({
  field,
  label,
  initialType = "eq",
  ...rest
}: TextFilterProps) => {
  return (
    <div className="grid-cols[auto_1fr] grid gap-x-4 gap-y-2">
      <label className="col-span-2" htmlFor={`${field}.value`}>
        {label}
      </label>

      <Field name={`${field}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={TEXT_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${field}.value`}>
        {({ field }: FieldProps) => (
          <InputText {...rest} {...field} value={field.value ?? ""} />
        )}
      </Field>
    </div>
  );
};

export default TextFilter;
