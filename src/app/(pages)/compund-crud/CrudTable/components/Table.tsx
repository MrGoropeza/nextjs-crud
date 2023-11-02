import { DataTableProps } from "primereact/datatable";
import { ReactNode } from "react";
import { useCrudTableContext } from "../context/CrudTableContext";
import { CrudTablePaginatorTemplate } from "./PaginatorTemplate";

interface TableChildrenProps {
  actionsTemplate: ReactNode;
  headerTemplate: ReactNode;
  tableState: DataTableProps<any>;
}

export interface TableProps {
  children: (props: TableChildrenProps) => ReactNode;
}

const Table = ({ children }: TableProps) => {
  const {
    templates: { actions, header },
    data,
  } = useCrudTableContext();

  const tableState: DataTableProps<any> = {
    value: data.items ?? [],
    first: (data.page - 1) * data.perPage,
    rows: data.perPage ?? 5,
    totalRecords: data.totalItems,
    lazy: true,
    paginator: true,
    paginatorTemplate: CrudTablePaginatorTemplate,
    header: header,
  };

  return children({
    tableState,
    actionsTemplate: actions,
    headerTemplate: header,
  });
};

export default Table;
