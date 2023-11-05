"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import CompoundForm from "./CompoundForm";
import { Crud } from "./CrudTable/CrudTable";
import { ListPageCriteria, ListPageResponse } from "./models/list.model";
import { UtherTodo } from "./models/todo.model";
import { ApiEndpoints, BaseApi } from "./services/base.api";

interface Props {
  data: ListPageResponse<UtherTodo>;
  query: ListPageCriteria;
}

const CompoundTable = ({ data, query }: Props) => {
  const api = BaseApi<UtherTodo>(ApiEndpoints.Todos);

  const dropdownOptions = ["1st", "2nd", "3rd"];

  return (
    <Crud modelId="todoId" api={api} data={data} query={query}>
      <Crud.Header className="grid grid-cols-[auto_1fr_auto_auto] gap-4">
        <Crud.Header.CreateButton />
        <Crud.Header.FiltersButton className="col-[3]" />
        <Crud.Header.SearchInput className="col-[4]" />
      </Crud.Header>

      <Crud.Table>
        {({ tableState, actionsTemplate }) => (
          <DataTable {...tableState}>
            <Column header="ID" field="todoId" />
            <Column header="Title" field="title" />
            <Column header="Description" field="description" />
            <Column header="Actions" body={actionsTemplate} />
          </DataTable>
        )}
      </Crud.Table>

      <Crud.Actions className="flex gap-2">
        {(row, { crudActions: { onEdit, onDelete } }) => (
          <>
            <Crud.Actions.EditButton onClick={() => onEdit(row)} />
            <Crud.Actions.DeleteButton onClick={() => onDelete(row)} />
          </>
        )}
      </Crud.Actions>

      <Crud.Form>{(row) => <CompoundForm row={row} />}</Crud.Form>

      <Crud.Filters className="flex flex-col gap-4">
        <Crud.Filters.Text name="filter1" />
        <Crud.Filters.Number name="filter2" />
        <Crud.Filters.Date name="filter3" />
        <Crud.Filters.Boolean name="filter4" />
        <Crud.Filters.Dropdown name="filter5" options={dropdownOptions} />
      </Crud.Filters>
    </Crud>
  );
};
export default CompoundTable;
