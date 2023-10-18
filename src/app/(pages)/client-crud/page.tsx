"use client";

import { ApiEndpoints } from "@app/enums";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { AdapterListTodo } from "./adapters/list.adapter";
import { CrudTable } from "./components/CrudTable";
import ClientCrudForm from "./components/Form";
import { ListPageCriteria } from "./models/interfaces/list-criteria.interface";
import { ClientTodo } from "./models/interfaces/todo.interface";
import { BaseApi } from "./services/base.service";

const ClientCRUD = () => {
  const api = BaseApi<ClientTodo>(ApiEndpoints.Todos, {
    list: { adapter: AdapterListTodo },
  });

  const initialState: ListPageCriteria = {
    start: 0,
    length: 5,
    query: {
      search: "",
      filters: [],
      sorts: [{ propertyName: "title" }],
    },
  };

  return (
    <section className="p-8">
      <CrudTable api={api} initialState={initialState}>
        {({
          tableState,
          modalState: { dialogVisible, setDialogVisible, id },
          defaultActionsTemplate,
        }) => {
          return (
            <>
              <DataTable {...tableState} dataKey="id">
                <Column header="ID" field="id" sortable />
                <Column header="Title" field="title" sortable />
                <Column header="Description" field="description" sortable />
                <Column body={defaultActionsTemplate} />
              </DataTable>

              <Dialog
                header={`${id ? "Edit" : "Create"} Todo`}
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
              >
                <ClientCrudForm />
              </Dialog>
            </>
          );
        }}
      </CrudTable>
    </section>
  );
};
export default ClientCRUD;
