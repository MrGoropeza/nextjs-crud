import { Field, FieldProps } from "formik";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";

type DropdownFilterType = "eq" | "neq";

const DROPDOWN_FILTER_TYPES: SelectItem[] = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
];

export interface DropdownFilterProps extends DropdownProps {
  name: string;
  initialValue?: any;
  initialType?: DropdownFilterType;
}

const DropdownFilter = ({
  name,
  initialValue = null,
  initialType = "eq",
  ...rest
}: DropdownFilterProps) => {
  return (
    <div className="flex gap-4">
      <Field name={`${name}.type`}>
        {({ field }: FieldProps) => (
          <Dropdown options={DROPDOWN_FILTER_TYPES} {...field} />
        )}
      </Field>

      <Field name={`${name}.value`}>
        {({ field }: FieldProps) => <Dropdown {...rest} {...field} />}
      </Field>
    </div>
  );
};

export default DropdownFilter;
