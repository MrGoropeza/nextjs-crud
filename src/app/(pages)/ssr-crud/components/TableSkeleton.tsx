"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

interface Props {
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: -1 | 1;
}

const TableSkeleton = ({ rows, page, sortField, sortOrder }: Props) => {
  return (
    <DataTable
      value={[...Array(rows)]}
      rows={rows}
      first={(page - 1) * rows}
      totalRecords={rows * page}
      rowsPerPageOptions={[5, 10, 15]}
      sortField={sortField}
      sortOrder={sortOrder}
      paginator
      lazy
    >
      <Column
        header="ID"
        body={<Skeleton height="19px" />}
        field="id"
        sortable
        sortableDisabled
      />
      <Column
        header="Title"
        body={<Skeleton height="19px" />}
        field="title"
        sortable
        sortableDisabled
      />
      <Column
        header="Description"
        body={<Skeleton height="19px" />}
        field="description"
        sortable
        sortableDisabled
      />
      <Column
        header="Created"
        body={<Skeleton height="19px" />}
        field="created"
        sortable
        sortableDisabled
      />
      <Column
        header="Updated"
        body={<Skeleton height="19px" />}
        field="updated"
        sortable
        sortableDisabled
      />
    </DataTable>
  );
};
export default TableSkeleton;
