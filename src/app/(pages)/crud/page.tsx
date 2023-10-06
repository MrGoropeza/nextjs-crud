"use client";
import styles from "./page.module.css";

import { ApiEndpoints, SortOrder } from "@app/enums";
import { useDebounce } from "@app/hooks/useDebounce.hook";
import { SortCriteria } from "@app/types/ListCriteria.type";
import { ListResponse } from "@app/types/ListResponse.type";
import { ToDo } from "@app/types/Todo.type";
import { useQuery } from "@tanstack/react-query";
import { Filter, Plus } from "lucide-react";
import { Button } from "primereact/button";
import { DataTableStateEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useState } from "react";
import CrudForm from "./crud-form/crud-form";
import CrudTable from "./crud-table/crud-table";

const API_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "";

const getTodos = (page: number, sort?: SortCriteria, search?: string) =>
  fetch(
    `${API_URL}/${ApiEndpoints.Todos}?page=${page}${
      sort && sort.field
        ? `&sort=${sort.order === SortOrder.ASC ? "+" : "-"}${sort.field}`
        : ""
    }&filter=(title~'${search}')`,
  ).then((response) => response.json() as Promise<ListResponse<ToDo>>);

const updateTodo = (todo: Partial<ToDo>) =>
  fetch(`${API_URL}/${ApiEndpoints.Todos}/${todo.id}`, {
    method: "PATCH",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

const createTodo = (todo: Partial<ToDo>) =>
  fetch(`${API_URL}/${ApiEndpoints.Todos}`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

const CrudPage = () => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [selectedRow, setSelectedRow] = useState<ToDo>();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortCriteria>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);

  const { data, isLoading } = useQuery(
    ["todos", page, sort, debouncedSearch],
    () => getTodos(page, sort, debouncedSearch),
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleRefresh = (e: DataTableStateEvent) => {
    console.log("onRefresh", e);

    setPage(e.first / e.rows + 1);
    setSort({
      field: e.sortField,
      order: e.sortOrder === 1 ? SortOrder.ASC : SortOrder.DESC,
    });
  };

  const handleOpenCreate = () => {
    setSelectedRow(undefined);
    setFormVisible(true);
  };

  const handleOpenEdit = (row: ToDo) => {
    setSelectedRow(row);
    setFormVisible(true);
  };

  const handleDelete = (row: ToDo) => {};

  const headerTemplate = () => (
    <header className={styles.toolbar}>
      <Button
        className="gap-1"
        label="Crear"
        severity="success"
        icon={<Plus size={16} />}
        onClick={handleOpenCreate}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          icon={<Filter size={16} />}
          onClick={() => setFiltersVisible(true)}
          size="small"
        />

        <InputText
          className="p-inputtext-sm pl-9"
          placeholder="Buscar..."
          value={search}
          onChange={handleSearch}
        />
      </div>
    </header>
  );

  return (
    <main className="flex h-full flex-col p-2 sm:p-10">
      {/* <header className={styles.toolbar}>
        <Button
          className="gap-1"
          label="Crear"
          severity="success"
          icon={<Plus size={16} />}
          onClick={handleOpenCreate}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            icon={<Filter size={16} />}
            onClick={() => setFiltersVisible(true)}
            size="small"
          />

          <InputText
            className="p-inputtext-sm pl-9"
            placeholder="Buscar..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </header> */}

      <CrudTable
        value={data?.items ?? []}
        rows={data?.perPage ?? 10}
        first={((data?.page ?? 1) - 1) * (data?.perPage ?? 0)}
        totalRecords={data?.totalItems ?? 0}
        sort={sort}
        loading={isLoading}
        onRefresh={handleRefresh}
        onEditRow={handleOpenEdit}
        onDeleteRow={handleDelete}
        header={headerTemplate}
      />

      <Dialog
        visible={filtersVisible}
        onHide={() => setFiltersVisible(false)}
        resizable={false}
        header="Filters"
      ></Dialog>

      <CrudForm
        visible={formVisible}
        onHide={() => setFormVisible(false)}
        row={selectedRow}
        onEdit={async (row) => {
          if (row.id) {
            await updateTodo(row);
            setPage(1);
          }
        }}
        onCreate={() => {}}
      />
    </main>
  );
};

export default CrudPage;
