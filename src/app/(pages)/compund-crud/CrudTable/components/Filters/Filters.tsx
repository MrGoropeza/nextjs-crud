"use client";

import { Form, Formik, FormikProps } from "formik";
import { Button } from "primereact/button";
import { ComponentProps, ReactElement, useRef, useState } from "react";
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

    let defaultInitialValue: any = null;

    if (filter.type === TextFilter) defaultInitialValue = "";

    return {
      [filter.props.name]: {
        value: filter.props.initialValue ?? defaultInitialValue,
        type: filter.props.initialType ?? defaultType,
      },
    };
  };

  const initialValues =
    children instanceof Array
      ? children.map(handleChild).reduce((acc, curr) => ({ ...acc, ...curr }))
      : children
      ? handleChild(children)
      : {};

  const [appliedFilters, setAppliedFilters] = useState(initialValues);

  const formRef = useRef<FormikProps<typeof initialValues>>(null);

  // useEffect(() => {
  //   const values = formRef.current?.values ?? {};

  //   setAppliedFilters(values);
  // }, []);

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={() => {}}
    >
      {(formik) => {
        const handleCancel = () => formik.setValues(appliedFilters);

        return (
          <Form {...rest}>
            {children}
            {debugValues && <pre>{JSON.stringify(formik.values, null, 2)}</pre>}

            <div className="flex justify-end gap-2">
              <Button label="Reset" type="reset" severity="danger" />
              <Button
                label="Cancel"
                type="button"
                severity="info"
                onClick={handleCancel}
              />
              <Button label="Apply" type="submit" severity="success" />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

Filters.Text = TextFilter;
Filters.Dropdown = DropdownFilter;
Filters.Number = NumberFilter;
Filters.Date = DateFilter;
Filters.Boolean = BooleanFilter;

export default Filters;
