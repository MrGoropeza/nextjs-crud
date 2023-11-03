"use client";

import { Field, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { SelectItem } from "primereact/selectitem";

type NumberFilterType = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "bt";

const NUMBER_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
  { label: "Less Than", value: "lt" },
  { label: "Less Than Or Equals", value: "lte" },
  { label: "Greater Than", value: "gt" },
  { label: "Greater Than Or Equals", value: "gte" },
  { label: "Between", value: "bt" },
];

export interface NumberFilterProps extends InputNumberProps {
  name: string;
  initialValue?: number;
  initialType?: NumberFilterType;
}

const NumberFilter = ({
  name,
  initialValue = 0,
  initialType = "eq",
  ...rest
}: NumberFilterProps) => {
  return (
    <div className="flex gap-4">
      <Field name={`${name}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={NUMBER_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${name}.value`}>
        {({ field, form }: FieldProps) => (
          <InputNumber
            {...rest}
            {...field}
            onChange={(value) => form.setFieldValue(field.name, value.value)}
          />
        )}
      </Field>
    </div>
  );
};

export default NumberFilter;
