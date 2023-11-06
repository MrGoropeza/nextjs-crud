"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useToast } from "../ssr-crud/context/toast.context";
import CompoundForm from "./CompoundForm";
import { Crud } from "./CrudTable/Crud";
import { ListPageCriteria, ListPageResponse } from "./models/list.model";
import { UtherTodo } from "./models/todo.model";
import { ApiEndpoints, BaseApi } from "./services/base.api";

interface Props {
  data: ListPageResponse<UtherTodo>;
  criteria: ListPageCriteria;
}

const CompoundTable = ({ data, criteria }: Props) => {
  const api = BaseApi<UtherTodo>(ApiEndpoints.Todos);
  const { showError, showSuccess } = useToast();
  const router = useRouter();

  const dateTemplate = (field: keyof UtherTodo) => (row: UtherTodo) => {
    const date = row[field];
    if (typeof date === "boolean") return "";

    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  };

  const doneTemplate = (row: UtherTodo) => {
    const handleChange = (e: CheckboxChangeEvent) => {
      api
        .update({ ...row, done: e.checked ?? false })
        .then(() => router.refresh())
        .catch(() => showError("Error while updating. Please try again."));
    };

    return <Checkbox checked={row.done} onChange={handleChange} />;
  };

  return (
    <Crud<UtherTodo> modelId="todoId" api={api} data={data} criteria={criteria}>
      <Crud.Header className="grid grid-cols-[auto_1fr_auto_auto] gap-4">
        <Crud.Header.CreateButton />
        <Crud.Header.FiltersButton className="col-[3]" />
        <Crud.Header.SearchInput className="col-[4]" />
      </Crud.Header>

      <Crud.Table>
        {({ tableState, actionsTemplate }) => (
          <DataTable {...tableState} removableSort={false}>
            <Column header="ID" field="todoId" sortable />
            <Column header="Title" field="title" sortable />
            <Column header="Description" field="description" sortable />
            <Column
              header="Updated At"
              field="updatedAt"
              sortable
              body={dateTemplate("updatedAt")}
            />
            <Column
              header="Created At"
              field="createdAt"
              sortable
              body={dateTemplate("createdAt")}
            />
            <Column header="Done" field="done" sortable body={doneTemplate} />
            <Column header="Actions" body={actionsTemplate} />
          </DataTable>
        )}
      </Crud.Table>

      <Crud.Actions className="flex max-w-min gap-2">
        {(row, { crudActions: { onEdit, onDelete } }) => (
          <>
            <Crud.Actions.EditButton onClick={() => onEdit(row)} />
            <Crud.Actions.DeleteButton onClick={() => onDelete(row)} />
          </>
        )}
      </Crud.Actions>

      <Crud.Form>{(row) => <CompoundForm row={row} />}</Crud.Form>

      <Crud.Filters className="grid grid-cols-1 gap-4">
        <Crud.Filters.Number field="todoId" label="ID" />
        <Crud.Filters.Text field="title" label="Title" />
        <Crud.Filters.Text field="description" label="Description" />
        <Crud.Filters.Date field="createdAt" label="CreatedAt" />
        <Crud.Filters.Date field="updatedAt" label="UpdatedAt" />
        <Crud.Filters.Boolean field="done" label="Done" />
      </Crud.Filters>
    </Crud>
  );
};
export default CompoundTable;
