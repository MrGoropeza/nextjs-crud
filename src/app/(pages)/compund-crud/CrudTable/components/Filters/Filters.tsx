"use client";

import { FilterCriterionType } from "@app/(pages)/compund-crud/models/list.model";
import { Form, Formik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { ComponentProps, ReactElement } from "react";
import { useCrudTableContext } from "../../context/CrudTableContext";
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
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();

  const {
    criteria,
    filtersState: { setVisible },
  } = useCrudTableContext();

  let defaultTypes: { [key: string]: FilterCriterionType } = {};

  const childToInitialValue = (child: ReactElement<FilterProps>) => {
    let defaultType: FilterCriterionType = "eq";

    if (child.type === DateFilter) defaultType = "lt";

    let defaultInitialValue = null;

    if (child.type === TextFilter) defaultInitialValue = "";

    defaultTypes = {
      ...defaultTypes,
      [child.props.field]: defaultType,
    };

    const currentFilters = criteria.query.filters ?? [];

    const appliedFilter = currentFilters.find(
      (item) => item.propertyName === child.props.field,
    );

    let appliedValue: string | number | boolean | Date | Date[] | undefined =
      appliedFilter?.value;
    let appliedType = appliedFilter?.type;

    if (
      child.type === DateFilter &&
      appliedFilter?.value &&
      appliedType !== "between"
    ) {
      const date = appliedFilter.value as Date;
      appliedValue = new Date(date);
    }

    if (
      child.type === DateFilter &&
      appliedType === "between" &&
      appliedFilter?.from &&
      appliedFilter?.to
    ) {
      appliedValue = [new Date(appliedFilter.from), new Date(appliedFilter.to)];
    }

    return {
      [child.props.field]: {
        value: appliedValue ?? defaultInitialValue,
        type: appliedFilter?.type ?? child.props.initialType ?? defaultType,
        from: appliedFilter?.from ?? defaultInitialValue,
        to: appliedFilter?.to ?? defaultInitialValue,
      },
    };
  };

  const initialValues =
    children instanceof Array
      ? children
          .map(childToInitialValue)
          .reduce((acc, curr) => ({ ...acc, ...curr }))
      : children
      ? childToInitialValue(children)
      : {};

  const handleSubmit = (values: typeof initialValues) => {
    const searchParams = new URLSearchParams(urlSearchParams);

    const filters = Object.entries(values)
      .map(([key, { value, type, from, to }]) => {
        return {
          propertyName: key,
          value: type !== "between" ? (value === "" ? null : value) : "",
          type,
          from: type === "between" ? from : null,
          to: type === "between" ? to : null,
        };
      })
      .filter(
        (item) =>
          (item.type !== "between" && item.value !== null) ||
          (item.type === "between" && item.from !== null && item.to !== null),
      );

    const newCriteria = {
      ...criteria,
      query: { ...criteria.query, filters },
    };

    searchParams.set("query", btoa(JSON.stringify(newCriteria.query)));
    router.replace(`${pathname}?${searchParams.toString()}`);
    router.refresh();

    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => {
        const handleReset = () => {
          const resetedValues = Object.keys(formik.values)
            .map((key) => ({
              [key]: {
                value: null,
                type: defaultTypes[key],
                from: null,
                to: null,
              },
            }))
            .reduce((acc, curr) => ({ ...acc, ...curr }));

          formik.setValues(resetedValues);
        };

        return (
          <Form {...rest}>
            {children}

            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2">
              <Button
                label="Reset"
                type="button"
                severity="danger"
                onClick={handleReset}
              />
              <Button
                className="col-[3]"
                label="Cancel"
                type="button"
                severity="info"
                onClick={handleCancel}
              />
              <Button
                className="col-[4]"
                label="Apply"
                type="submit"
                severity="success"
              />
            </div>

            {debugValues && <pre>{JSON.stringify(formik.values, null, 2)}</pre>}
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
