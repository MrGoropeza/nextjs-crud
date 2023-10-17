export interface ListPageRequest {
  page: number;
  rows: number;
  sort?: `${"+" | "-"}${string}`;
}

export interface ApiListPageResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ListPageData<T> {
  records: T[];
  page: number;
  rows: number;
  totalRecords: number;
  totalPages: number;
}
