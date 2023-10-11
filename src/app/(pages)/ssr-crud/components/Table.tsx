"use client";

import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column, ColumnBodyOptions } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { deleteTodo } from "../services/todo.service";
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
  const params = new URLSearchParams(searchParams);

  const dateTemplate = (data: Todo, col: ColumnBodyOptions) =>
    dayjs(data[col.field as keyof Todo]).format("DD/MM/YYYY HH:mm");

  const actionsTemplate = (data: Todo) => {
    const handleEdit = () =>
      router.push(`/ssr-crud/${data.id}?${params.toString()}`);

    const handleDelete = () =>
      confirmDialog({
        message: "Are you sure you want to delete this item?",
        header: "Confirm",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          const res = await deleteTodo(data.id);

          console.log(res);
        },
        reject: () => {},
      });

    return (
      <div className="flex max-w-min gap-2">
        <Button severity="info" icon={<Pencil />} onClick={handleEdit} />
        <Button severity="danger" icon={<Trash />} onClick={handleDelete} />
      </div>
    );
  };

  const handlePage = (e: DataTablePageEvent) => {
    params.set("page", `${e.first / e.rows + 1}`);
    params.set("rows", `${e.rows}`);

    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleSort = (e: DataTableSortEvent) => {
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
    <>
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
        <Column
          className="max-w-0 overflow-hidden"
          header="ID"
          field="id"
          sortable
        />
        <Column
          className="max-w-0 overflow-hidden"
          header="Title"
          field="title"
          sortable
        />
        <Column
          className="max-w-0 overflow-hidden"
          header="Description"
          field="description"
          sortable
        />
        <Column
          className="max-w-0 overflow-hidden"
          header="Created"
          field="created"
          body={dateTemplate}
          sortable
        />
        <Column
          className="max-w-0 overflow-hidden"
          header="Updated"
          field="updated"
          body={dateTemplate}
          sortable
        />
        <Column className="w-0 min-w-fit" body={actionsTemplate} />
      </DataTable>

      <ConfirmDialog />
    </>
  );
};

export default SSRCrudTable;
