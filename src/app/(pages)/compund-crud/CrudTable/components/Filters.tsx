"use client";

import { Formik } from "formik";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";
import { ReactElement, useState } from "react";

const filterTypes: SelectItem[] = [
  {
    label: "Contains",
    value: "like",
  },
  {
    label: "Does Not Contain",
    value: "notLike",
  },
  {
    label: "Equals",
    value: "eq",
  },
  {
    label: "Not Equals",
    value: "neq",
  },
  {
    label: "Starts With",
    value: "startsWith",
  },
  {
    label: "Ends With",
    value: "endsWith",
  },
];

type FilterProps =
  | TextFilterProps
  | NumberFilterProps
  | DateFilterProps
  | BooleanFilterProps
  | DropdownFilterProps;

export interface FiltersProps {
  children?: ReactElement<FilterProps>[] | ReactElement<FilterProps>;
}

const Filters = ({ children }: FiltersProps) => {
  const handleChild = (filter: ReactElement<FilterProps>) => ({
    name: filter.props.name,
    initialValue: filter.props.initialValue,
  });

  const initialValues =
    children instanceof Array
      ? children
          .map(handleChild)
          .reduce(
            (acc, curr) => ({ ...acc, [curr.name]: curr.initialValue }),
            {},
          )
      : children
      ? { [children.props.name]: children.props.initialValue }
      : {};

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {() => <section>{children}</section>}
      </Formik>

      <pre>{JSON.stringify(initialValues, null, 2)}</pre>
    </>
  );
};

interface TextFilterProps {
  name: string;
  initialValue: any;
}

const TextFilter = ({}: TextFilterProps) => {
  const [selectedType, setSelectedType] = useState("like");

  return (
    <div className="flex gap-4">
      <Dropdown
        options={filterTypes}
        value={selectedType}
        onChange={(e) => setSelectedType(e.value)}
      />

      <InputText placeholder="Filter by Value" />
    </div>
  );
};

interface DropdownFilterProps {
  name: string;
  initialValue: any;
}

const DropdownFilter = ({}: DropdownFilterProps) => {
  return (
    <div className="flex gap-4">
      <Dropdown />
    </div>
  );
};

interface NumberFilterProps {
  name: string;
  initialValue: any;
}

const NumberFilter = ({}: NumberFilterProps) => {
  return (
    <div className="flex gap-4">
      <Dropdown options={filterTypes} />

      <InputNumber placeholder="Filter by Value" />
    </div>
  );
};

interface DateFilterProps {
  name: string;
  initialValue: any;
}

const DateFilter = ({}: DateFilterProps) => {
  return (
    <div className="flex gap-4">
      <Dropdown options={filterTypes} />

      <Calendar />
    </div>
  );
};

interface BooleanFilterProps {
  name: string;
  initialValue: any;
}

const BooleanFilter = ({}: BooleanFilterProps) => {
  return (
    <div>
      <InputSwitch checked />
    </div>
  );
};

Filters.Text = TextFilter;
Filters.Dropdown = DropdownFilter;
Filters.Number = NumberFilter;
Filters.Date = DateFilter;
Filters.Boolean = BooleanFilter;

export default Filters;
