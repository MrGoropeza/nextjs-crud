import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DataTablePageEvent,
  DataTableProps,
  DataTableSortEvent,
} from "primereact/datatable";
import { ReactNode, useMemo } from "react";
import { QueryCriteria } from "../../models/list.model";
import { useCrudTableContext } from "../context/CrudTableContext";
import { CrudTablePaginatorTemplate } from "./PaginatorTemplate";

interface TableChildrenProps {
  actionsTemplate: (row: any) => ReactNode;
  headerTemplate: ReactNode;
  tableState: DataTableProps<any>;
}

export interface TableProps {
  children: (props: TableChildrenProps) => ReactNode;
}

const Table = ({ children }: TableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const searchParams = new URLSearchParams(urlSearchParams);

  const {
    templates: { actions, header },
    data,
    criteria,
  } = useCrudTableContext();

  const handlePage = (e: DataTablePageEvent) => {
    searchParams.set("page", `${e.first / e.rows + 1}`);
    searchParams.set("rows", `${e.rows}`);

    router.replace(`${pathname}?${searchParams.toString()}`);

    router.refresh();
  };

  const handleSort = (e: DataTableSortEvent) => {
    const newQuery: QueryCriteria = {
      ...criteria.query,
      sorts:
        e.multiSortMeta?.map((sort) => ({
          propertyName: sort.field,
          descending: sort.order === -1,
        })) ?? [],
    };

    searchParams.set("query", btoa(JSON.stringify(newQuery)));

    router.replace(`${pathname}?${searchParams.toString()}`);

    router.refresh();
  };

  const tableState: DataTableProps<any> = useMemo(
    () => ({
      value: data.data ?? [],
      first: data.start,
      rows: data.length ?? 5,
      totalRecords: data.count,
      lazy: true,
      paginator: true,
      removableSort: true,
      sortMode: "multiple",
      multiSortMeta: criteria.query.sorts.map((sort) => ({
        field: sort.propertyName,
        order: sort.descending ? -1 : 1,
      })),
      paginatorTemplate: CrudTablePaginatorTemplate,
      header: header,
      rowsPerPageOptions: [1, 5, 10, 25, 50],
      emptyMessage: "No records found",
      onPage: handlePage,
      onSort: handleSort,
    }),
    [data, criteria],
  );

  return children({
    tableState,
    actionsTemplate: actions,
    headerTemplate: header,
  });
};

export default Table;
