import { SortOrder } from "@app/enums";

export type ListPageCriteria = {
  page: number;
  rows: number;
  sort?: SortCriteria;
};

export type SortCriteria = {
  field: string;
  order: SortOrder;
};
