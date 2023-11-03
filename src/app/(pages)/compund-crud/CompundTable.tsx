"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { CrudTable } from "./CrudTable/CrudTable";
import { ListPageCriteria } from "./CrudTable/models/list.model";
import { ListResponse, Todo, TodoApi } from "./services/todo.api";

interface Props {
  data: ListResponse<Todo>;
  query: ListPageCriteria;
}

const CompoundTable = ({ data, query }: Props) => {
  const api = TodoApi();

  const dropdownOptions = ["1st", "2nd", "3rd"];

  return (
    <CrudTable api={api} data={data} query={query}>
      <CrudTable.Header className="grid grid-cols-[auto_1fr_auto_auto] gap-4">
        <CrudTable.Header.CreateButton />
        <CrudTable.Header.FiltersButton className="col-[3]" />
        <CrudTable.Header.SearchInput className="col-[4]" />
      </CrudTable.Header>

      <CrudTable.Table>
        {({ tableState, actionsTemplate }) => (
          <DataTable {...tableState}>
            <Column header="ID" field="id" />
            <Column header="Title" field="title" />
            <Column header="Description" field="description" />
            <Column header="Actions" body={actionsTemplate} />
          </DataTable>
        )}
      </CrudTable.Table>

      <CrudTable.Actions className="flex gap-2">
        {(row, { crudActions: { onEdit, onDelete } }) => (
          <>
            <CrudTable.Actions.EditButton onClick={() => onEdit(row)} />
            <CrudTable.Actions.DeleteButton onClick={() => onDelete(row)} />
          </>
        )}
      </CrudTable.Actions>

      <CrudTable.Form>
        {(row) => (
          <>
            <p>El form</p>
            <pre>{JSON.stringify(row, null, 2)}</pre>
          </>
        )}
      </CrudTable.Form>

      <CrudTable.Filters className="flex flex-col gap-4">
        <CrudTable.Filters.Text name="filter1" />
        <CrudTable.Filters.Number name="filter2" />
        <CrudTable.Filters.Date name="filter3" />
        <CrudTable.Filters.Boolean name="filter4" />
        <CrudTable.Filters.Dropdown name="filter5" options={dropdownOptions} />
      </CrudTable.Filters>
    </CrudTable>
  );
};
export default CompoundTable;
