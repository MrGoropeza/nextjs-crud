export interface ListPageCriteria {
  start: number;
  length: number;
  query: QueryCriteria;
  includes?: boolean;
}

export interface ListPageResponse<T> {
  count: number;
  start: number;
  length: number;
  data: T[];
}

export interface QueryCriteria {
  sorts: SortCriterion[];
  filters: FilterCriterion[];
  search?: string;
}

export interface SortCriterion {
  propertyName: string;
  descending?: boolean;
}

export type FilterCriterionType =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "like"
  | "contains"
  | "between";

export interface FilterCriterion<T = any> {
  propertyName: string & keyof T;
  type: FilterCriterionType;
  value: number | string | boolean | Date;
  from?: number | Date;
  to?: number | Date;

  or?: FilterCriterion<T>[];
  and?: FilterCriterion<T>[];
}
