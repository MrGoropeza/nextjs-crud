"use client";
import styles from "./crud-table.module.css";

import UiDataTable from "@app/components/UiDataTable";
import { SortOrder } from "@app/enums";
import { SortCriteria } from "@app/types/ListCriteria.type";
import { ToDo } from "@app/types/Todo.type";
import { Pencil, Trash } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTableProps,
  DataTableStateEvent,
  DataTableValueArray,
} from "primereact/datatable";

type Props = {
  // data: ToDo[];
  first: number;
  rows: number;
  totalRecords: number;
  loading?: boolean;
  sort?: SortCriteria;
  onRefresh?: (e: DataTableStateEvent) => void;
  onEditRow?: (row: ToDo) => void;
  onDeleteRow?: (row: ToDo) => void;
};

const CrudTable = <T extends DataTableValueArray>({
  first,
  rows,
  totalRecords,
  sort,
  loading,
  onRefresh,
  onEditRow,
  onDeleteRow,
  ...rest
}: Props & DataTableProps<T>) => {
  const actionsTemplate = (row: ToDo) => (
    <div className="flex gap-2">
      <Button
        severity="secondary"
        icon={<Pencil size={16} />}
        onClick={() => onEditRow && onEditRow(row)}
      />
      <Button
        severity="danger"
        icon={<Trash size={16} />}
        onClick={() => onDeleteRow && onDeleteRow(row)}
      />
    </div>
  );

  return (
    <UiDataTable
      className={styles["crud-table"]}
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      sortField={sort?.field}
      sortOrder={sort?.order === SortOrder.ASC ? 1 : -1}
      loading={loading}
      onFilter={onRefresh}
      onPage={onRefresh}
      onSort={onRefresh}
      removableSort
      lazy
      paginator
      {...rest}
    >
      <Column header="ID" field="id" sortable />
      <Column header="Title" field="title" sortable />
      <Column header="Description" field="description" sortable />
      <Column header="Actions" body={actionsTemplate} />
    </UiDataTable>
  );
};

export default CrudTable;
