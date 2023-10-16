"use client";

import dayjs from "dayjs";
import { AlertTriangle, Pencil, RefreshCcw, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Column, ColumnBodyOptions } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { useState } from "react";
import { deleteTodo } from "../services/todo.service";
import { Todo } from "../types/todo.type";

type Props = {
  data: Todo[];
  rows: number;
  first: number;
  totalRecords: number;
  sortField?: string;
  sortOrder?: -1 | 1;
};

const SSRCrudTable = ({
  data,
  first,
  rows,
  totalRecords,
  sortField,
  sortOrder,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const dateTemplate = (data: Todo, col: ColumnBodyOptions) =>
    dayjs(data[col.field as keyof Todo]).format("DD/MM/YYYY HH:mm");

  const actionsTemplate = (data: Todo) => {
    const handleEdit = () => {
      router.refresh();
      router.push(`/ssr-crud/${data.id}?${params.toString()}`);
    };

    const handleDelete = () =>
      confirmDialog({
        message: "Are you sure you want to delete this item?",
        header: "Confirm",
        icon: <AlertTriangle />,
        accept: () => {
          setLoading(true);

          deleteTodo(data.id)
            .then(() => {
              location.reload();
              // router.replace(`/ssr-crud?${params.toString()}`);
            })
            .finally(() => setLoading(false));

          // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
          // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud/[id]`);
        },
        reject: () => {},
      });

    return (
      <div className="flex gap-2">
        <Button severity="info" icon={<Pencil />} onClick={handleEdit} />
        <Button severity="danger" icon={<Trash />} onClick={handleDelete} />
      </div>
    );
  };

  const headerTemplate = () => (
    <header className="grid grid-cols-[auto_auto_1fr_auto] gap-4">
      <Button icon={<RefreshCcw />} onClick={handleRefresh} />
      <Button label="Create" severity="success" onClick={handleCreate} />
      <InputText className="col-[4]" placeholder="Search..." />
    </header>
  );

  const handlePage = async (e: DataTablePageEvent) => {
    params.set("page", `${e.first / e.rows + 1}`);
    params.set("rows", `${e.rows}`);

    // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
    router.refresh();
    router.replace(`/ssr-crud?${params.toString()}`);
  };

  const handleSort = async (e: DataTableSortEvent) => {
    if (!e.sortField && !e.sortOrder) {
      params.delete("sortField");
      params.delete("sortOrder");
    }

    if (e.sortField && e.sortOrder) {
      params.set("sortField", `${e.sortField}`);
      params.set("sortOrder", `${e.sortOrder === -1 ? "desc" : "asc"}`);
    }

    // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
    router.refresh();
    router.replace(`/ssr-crud?${params.toString()}`);
  };

  const handleRefresh = async () => {
    // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
    // router.replace(`/ssr-crud?${params.toString()}`);
    router.refresh();
  };

  const handleCreate = async () => {
    router.replace(`/ssr-crud/create?${params.toString()}`);
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
        header={headerTemplate}
        lazy
        paginator
        removableSort
      >
        <Column header="ID" field="id" sortable />
        <Column header="Title" field="title" sortable />
        <Column header="Description" field="description" sortable />
        <Column header="Created" field="created" body={dateTemplate} sortable />
        <Column header="Updated" field="updated" body={dateTemplate} sortable />
        <Column body={actionsTemplate} />
      </DataTable>

      <ConfirmDialog />

      <Dialog
        header={"Loading..."}
        visible={loading}
        closable={false}
        onHide={() => {}}
      >
        <ProgressBar mode="indeterminate" />
      </Dialog>
    </>
  );
};

export default SSRCrudTable;
