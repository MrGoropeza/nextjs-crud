import { useRouter, useSearchParams } from "next/navigation";
import { DataTableProps, DataTableSortEvent } from "primereact/datatable";
import { ReactNode } from "react";
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
  const searchParams = useSearchParams();

  const {
    templates: { actions, header },
    data,
  } = useCrudTableContext();

  const handlePage = (e: DataTableSortEvent) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", `${e.first / e.rows + 1}`);
    params.set("rows", `${e.rows}`);

    router.replace(`/compund-crud?${params.toString()}`);

    router.refresh();
  };

  const tableState: DataTableProps<any> = {
    value: data.data ?? [],
    first: data.start,
    rows: data.length ?? 5,
    totalRecords: data.count,
    lazy: true,
    paginator: true,
    paginatorTemplate: CrudTablePaginatorTemplate,
    header: header,
    rowsPerPageOptions: [1, 5, 10, 25, 50],
    emptyMessage: "No records found",
    onPage: handlePage,
  };

  return children({
    tableState,
    actionsTemplate: actions,
    headerTemplate: header,
  });
};

export default Table;
