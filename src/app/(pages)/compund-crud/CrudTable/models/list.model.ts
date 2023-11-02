export interface ListPageCriteria {
  start: number;
  length: number;
  query: QueryCriteria;
}

export interface QueryCriteria {
  sorts: SortCriterion[];
  filters: FilterCriterion[];
  search: string;
}

export interface SortCriterion {
  propertyName: string;
  descending?: boolean;
}

export interface FilterCriterion {
  propertyName: string;
  type: string;
  value: number | string | boolean | Date;
  from?: string;
  to?: string;

  or?: FilterCriterion[];
  and?: FilterCriterion[];
}
