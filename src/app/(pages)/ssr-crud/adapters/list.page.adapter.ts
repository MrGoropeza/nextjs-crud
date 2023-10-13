import { ApiListPageResponse, ListPageData } from "../types/list-page.type";

export function AdapterListPage<ResponseType, AdaptedType>(
  data: ApiListPageResponse<ResponseType>,
  itemAdapter: (item: ResponseType) => AdaptedType,
): ListPageData<AdaptedType> {
  return {
    page: data.page,
    rows: data.perPage,
    totalPages: data.totalPages,
    totalRecords: data.totalItems,
    records: data.items.map(itemAdapter),
  };
}

export function AdapterListPageFn<ResponseType, AdaptedType>(
  itemAdapter: (item: ResponseType) => AdaptedType,
): (data: ApiListPageResponse<ResponseType>) => ListPageData<AdaptedType> {
  const adapter = (
    data: ApiListPageResponse<ResponseType>,
  ): ListPageData<AdaptedType> => ({
    page: data.page,
    rows: data.perPage,
    totalPages: data.totalPages,
    totalRecords: data.totalItems,
    records: data.items.map(itemAdapter),
  });

  return adapter;
}
