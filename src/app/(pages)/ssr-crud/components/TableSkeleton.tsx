"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";

interface Props {
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: -1 | 1;
}

const TableSkeleton = ({ rows, page, sortField, sortOrder }: Props) => {
  const headerTemplate = () => (
    <header className="grid grid-cols-[auto_auto_1fr_auto] gap-4">
      <Button icon={<RefreshCcw />} disabled />
      <Button label="Create" severity="success" disabled />
      <InputText className="col-[4]" placeholder="Search..." disabled />
    </header>
  );

  return (
    <DataTable
      value={[...Array(rows)]}
      rows={rows}
      first={(page - 1) * rows}
      totalRecords={rows * page}
      rowsPerPageOptions={[5, 10, 15]}
      sortField={sortField}
      sortOrder={sortOrder}
      header={headerTemplate}
      paginator
      lazy
    >
      <Column
        header="ID"
        body={<Skeleton height="48px" />}
        field="id"
        sortable
        sortableDisabled
      />
      <Column
        header="Title"
        body={<Skeleton height="48px" />}
        field="title"
        sortable
        sortableDisabled
      />
      <Column
        header="Description"
        body={<Skeleton height="48px" />}
        field="description"
        sortable
        sortableDisabled
      />
      <Column
        header="Created"
        body={<Skeleton height="48px" />}
        field="created"
        sortable
        sortableDisabled
      />
      <Column
        header="Updated"
        body={<Skeleton height="48px" />}
        field="updated"
        sortable
        sortableDisabled
      />
      <Column body={<Skeleton height="48px" />} />
    </DataTable>
  );
};
export default TableSkeleton;
