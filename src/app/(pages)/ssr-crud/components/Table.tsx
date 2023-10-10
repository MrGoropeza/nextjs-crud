"use client";

import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { Todo } from "../types/todo.type";

type Props = {
  data: Todo[];
  rows: number;
  first: number;
  totalRecords: number;
  sortField?: string;
  sortOrder?: -1 | 1;
  searchParams: { [key: string]: string };
};

const SSRCrudTable = ({
  searchParams,
  data,
  first,
  rows,
  totalRecords,
  sortField,
  sortOrder,
}: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const dateTemplate = (field: keyof Todo) => (data: Todo) =>
    dayjs(data[field]).format("DD/MM/YYYY HH:mm");

  const actionsTemplate = (data: Todo) => {
    return (
      <div className="flex max-w-min gap-2">
        <Button severity="info" icon={<Pencil />} />
        <Button severity="danger" icon={<Trash />} />
      </div>
    );
  };

  const handlePage = (e: DataTablePageEvent) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${e.first / e.rows + 1}`);
    params.set("rows", `${e.rows}`);

    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleSort = (e: DataTableSortEvent) => {
    const params = new URLSearchParams(searchParams);
    if (!e.sortField && !e.sortOrder) {
      params.delete("sortField");
      params.delete("sortOrder");
    }

    if (e.sortField && e.sortOrder) {
      params.set("sortField", `${e.sortField}`);
      params.set("sortOrder", `${e.sortOrder === -1 ? "desc" : "asc"}`);
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <DataTable
      value={data}
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      sortField={sortField}
      sortOrder={sortOrder}
      onPage={handlePage}
      onSort={handleSort}
      rowsPerPageOptions={[5, 10, 15]}
      lazy
      paginator
      removableSort
    >
      <Column header="ID" field="id" sortable />
      <Column header="Title" field="title" sortable />
      <Column header="Description" field="description" sortable />
      <Column
        header="Created"
        field="created"
        body={dateTemplate("created")}
        sortable
      />
      <Column
        header="Updated"
        field="updated"
        body={dateTemplate("updated")}
        sortable
      />
      <Column body={actionsTemplate} />
    </DataTable>
  );
};

export default SSRCrudTable;
