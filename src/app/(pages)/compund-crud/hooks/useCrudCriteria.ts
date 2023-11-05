import { array, boolean, object, string } from "yup";
import { ListPageCriteria, QueryCriteria } from "../models/list.model";

const filterValidator = array(
  object({
    propertyName: string().required(),
    type: string()
      .oneOf([
        "eq",
        "neq",
        "gt",
        "lt",
        "gte",
        "lte",
        "like",
        "contains",
        "between",
      ])
      .required(),
    value: string().required(),
  }),
);

const queryValidator = object({
  filters: filterValidator.required(),
  sorts: array(
    object({
      propertyName: string().required(),
      descending: boolean(),
    }),
  ).required(),
  search: string().default(undefined),
});

export const useCrudCriteria = (
  searchParams: { [key: string]: string } | URLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);

  const actualQueryString = params.get("query");

  let query: QueryCriteria = {
    filters: [],
    sorts: [],
    search: "",
  };

  try {
    if (actualQueryString) {
      const parsedQuery = JSON.parse(atob(actualQueryString));

      queryValidator.isValidSync(parsedQuery) && (query = parsedQuery);
    }
  } catch (error) {}

  const page = +(params.get("page") ?? 1);
  const rows = +(params.get("rows") ?? 5);

  const criteria: ListPageCriteria = {
    start: (page - 1) * rows,
    length: rows,
    query,
  };

  return criteria;
};
