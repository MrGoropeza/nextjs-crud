"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { CrudTable } from "./CrudTable/CrudTable";
import { ListResponse, Todo, TodoApi } from "./services/todo.api";

interface Props {
  data: ListResponse<Todo>;
}

const CompoundTable = ({ data }: Props) => {
  const api = TodoApi();

  return (
    <CrudTable data={data} api={api}>
      {/* Custom Header */}
      {/* <CrudTable.Header>
        <p>Im Header</p>
      </CrudTable.Header> */}

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

      {/* Custom Actions */}
      {/* <CrudTable.Actions>
        {(row) => (
          <p>
            {row.id} - {row.title}
          </p>
        )}
      </CrudTable.Actions> */}

      <CrudTable.Filters>
        <p>Im Filters</p>
      </CrudTable.Filters>
    </CrudTable>
  );
};
export default CompoundTable;
