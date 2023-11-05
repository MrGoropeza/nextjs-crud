import { Field, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch, InputSwitchProps } from "primereact/inputswitch";
import { SelectItem } from "primereact/selectitem";

type BooleanFilterType = "eq" | "neq";

const BOOLEAN_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
];

export interface BooleanFilterProps extends Omit<InputSwitchProps, "checked"> {
  field: string;
  initialType?: BooleanFilterType;
}

const BooleanFilter = ({ field, ...rest }: BooleanFilterProps) => {
  return (
    <div className="flex gap-4">
      <Field name={`${field}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={BOOLEAN_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${field}.value`}>
        {({ field }: FieldProps) => (
          <InputSwitch {...rest} {...field} checked={field.value} />
        )}
      </Field>
    </div>
  );
};

export default BooleanFilter;
