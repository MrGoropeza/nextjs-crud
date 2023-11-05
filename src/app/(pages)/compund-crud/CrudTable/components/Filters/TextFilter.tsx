"use client";

import { Field, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputText, InputTextProps } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";

type FilterType = "contains" | "startswith" | "endswith" | "eq" | "neq";

const TEXT_FILTER_TYPES: SelectItem[] = [
  {
    label: "Contains",
    value: "contains",
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
  name: string;
  initialType?: FilterType;
}

const TextFilter = ({ name, initialType = "eq", ...rest }: TextFilterProps) => {
  return (
    <div className="flex gap-4">
      <Field name={`${name}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={TEXT_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${name}.value`}>
        {({ field }: FieldProps) => <InputText {...rest} {...field} />}
      </Field>
    </div>
  );
};

export default TextFilter;
