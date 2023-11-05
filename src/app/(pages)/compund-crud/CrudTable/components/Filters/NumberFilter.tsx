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
  name: string;
  initialType?: NumberFilterType;
  label: string;
}

const NumberFilter = ({
  name,
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
      <label className="col-span-2" htmlFor={`${name}.value`}>
        {label}
      </label>

      <Field name={`${name}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={NUMBER_FILTER_TYPES} {...field} />
        )}
      </Field>

      {values[name].type !== "between" && (
        <Field name={`${name}.value`}>
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

      {values[name].type === "between" && (
        <>
          <Field name={`${name}.from`}>
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

          <Field name={`${name}.to`}>
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
