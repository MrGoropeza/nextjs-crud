export interface ListPageResponse<T = any> {
  count: number;
  start: number;
  length: number;
  data: T[];
}
