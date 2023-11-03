"use client";

import { Form, Formik } from "formik";
import { ComponentProps, ReactElement } from "react";
import BooleanFilter, { BooleanFilterProps } from "./BooleanFilter";
import DateFilter, { DateFilterProps } from "./DateFilter";
import DropdownFilter, { DropdownFilterProps } from "./DropdownFilter";
import NumberFilter, { NumberFilterProps } from "./NumberFilter";
import TextFilter, { TextFilterProps } from "./TextFilter";

type FilterProps =
  | TextFilterProps
  | NumberFilterProps
  | DateFilterProps
  | BooleanFilterProps
  | DropdownFilterProps;

export interface FiltersProps
  extends Omit<ComponentProps<"form">, "children" | "ref"> {
  children?: ReactElement<FilterProps>[] | ReactElement<FilterProps>;
  debugValues?: boolean;
}

const Filters = ({ children, debugValues, ...rest }: FiltersProps) => {
  const handleChild = (filter: ReactElement<FilterProps>) => {
    const defaultType = "eq";

    let defaultInitialValue: any = "";
    if (filter.type === NumberFilter) {
      defaultInitialValue = 0;
    }
    if (filter.type === DateFilter) {
      defaultInitialValue = new Date();
    }
    if (filter.type === BooleanFilter) {
      defaultInitialValue = false;
    }
    if (filter.type === DropdownFilter) {
      defaultInitialValue = null;
    }

    return {
      [filter.props.name]: {
        value: filter.props.initialValue ?? defaultInitialValue,
        type: filter.props.initialType ?? defaultType,
      },
    };
  };

  const initialValues =
    children instanceof Array
      ? children
          .map(handleChild)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {})
      : children
      ? handleChild(children)
      : {};

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {(formik) => (
        <Form {...rest}>
          {children}
          {debugValues && <pre>{JSON.stringify(formik.values, null, 2)}</pre>}
        </Form>
      )}
    </Formik>
  );
};

Filters.Text = TextFilter;
Filters.Dropdown = DropdownFilter;
Filters.Number = NumberFilter;
Filters.Date = DateFilter;
Filters.Boolean = BooleanFilter;

export default Filters;
