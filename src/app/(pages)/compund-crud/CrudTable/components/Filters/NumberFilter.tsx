"use client";

import { Field, FieldProps, useFormikContext } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { SelectItem } from "primereact/selectitem";

type NumberFilterType = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "between";

const NUMBER_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
  { label: "Less Than", value: "lt" },
  { label: "Less Than Or Equals", value: "lte" },
  { label: "Greater Than", value: "gt" },
  { label: "Greater Than Or Equals", value: "gte" },
  { label: "Between", value: "between" },
];

export interface NumberFilterProps extends InputNumberProps {
  field: string;
  label: string;
  initialType?: NumberFilterType;
}

const NumberFilter = ({
  field,
  initialType = "eq",
  label,
  className,
  ...rest
}: NumberFilterProps) => {
  const { values } = useFormikContext<{
    [key: string]: { type: NumberFilterType; value: number };
  }>();

  return (
    <div className="grid-cols[auto_1fr] grid gap-x-4 gap-y-2">
      <label className="col-span-2" htmlFor={`${field}.value`}>
        {label}
      </label>

      <Field name={`${field}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={NUMBER_FILTER_TYPES} {...field} />
        )}
      </Field>

      {values[field].type !== "between" && (
        <Field name={`${field}.value`}>
          {({ field, form }: FieldProps) => (
            <InputNumber
              className={className}
              {...rest}
              {...field}
              onChange={(e) => form.setFieldValue(field.name, e.value)}
            />
          )}
        </Field>
      )}

      {values[field].type === "between" && (
        <>
          <Field name={`${field}.from`}>
            {({ field, form }: FieldProps) => (
              <InputNumber
                className={`${className} col-[2]`}
                placeholder="From"
                {...rest}
                {...field}
                onChange={(e) => form.setFieldValue(field.name, e.value)}
              />
            )}
          </Field>

          <Field name={`${field}.to`}>
            {({ field, form }: FieldProps) => (
              <InputNumber
                className={`${className} col-[2]`}
                placeholder="To"
                {...rest}
                {...field}
                onChange={(e) => form.setFieldValue(field.name, e.value)}
              />
            )}
          </Field>
        </>
      )}
    </div>
  );
};

export default NumberFilter;
