"use client";

import { AlertTriangle } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { ReactElement, useState } from "react";
import { BaseApi, ListResponse } from "../services/todo.api";
import Actions, { ActionsProps } from "./components/Actions";
import Filters, { FiltersProps } from "./components/Filters/Filters";
import Form, { FormProps } from "./components/Form";
import Header, { HeaderProps } from "./components/Header";
import Table, { TableProps } from "./components/Table";
import { CrudTableContextProvider } from "./context/CrudTableContext";
import { ListPageCriteria } from "./models/list.model";

interface CrudTableProps {
  children: ReactElement<
    TableProps | ActionsProps | FiltersProps | HeaderProps | FormProps
  >[];
  data: ListResponse<any>;
  api: BaseApi;
  query: ListPageCriteria;
}

export const CrudTable = ({ data, query, api, children }: CrudTableProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();

  const tableTemplate = children.find((child) => child.type === Table);
  const headerTemplate = children.find((child) => child.type === Header);
  const actionsTemplate = children.find((child) => child.type === Actions);
  const filtersTemplate = children.find((child) => child.type === Filters);
  const formTemplate = children.find((child) => child.type === Form);

  const filtersState = {
    visible: filtersVisible,
    setVisible: setFiltersVisible,
  };

  const templates = {
    header: headerTemplate,
    actions: actionsTemplate
      ? (row: any) => (
          <actionsTemplate.type {...actionsTemplate.props} row={row} />
        )
      : () => <></>,
    filters: filtersTemplate,
  };

  const handleCreateButton = () => {
    setSelectedRow(undefined);
    setFormVisible(true);
  };
  const handleFilterButton = () => {
    setFiltersVisible(true);
  };
  const handleEditButton = (row: any) => {
    setSelectedRow(row);
    setFormVisible(true);
  };
  const handleDeleteButton = (row: any) => {
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Confirm",
      icon: <AlertTriangle />,
      accept: () => {
        api.delete(`${row.id}`).then(() => {
          // showSuccess("Deleted successfully");
        });
        // .catch(() => showError("Error while deleting. Please try again."))
        // .finally(() => setLoading(false));
      },
    });
  };

  const crudActions = {
    onEdit: handleEditButton,
    onDelete: handleDeleteButton,
    onCreate: handleCreateButton,
    onFilter: handleFilterButton,
  };

  return (
    <CrudTableContextProvider
      value={{ data, filtersState, templates, crudActions }}
    >
      {tableTemplate}

      <ConfirmDialog />

      <Dialog
        header="Filters"
        visible={filtersVisible}
        draggable={false}
        resizable={false}
        onHide={() => setFiltersVisible(false)}
      >
        {filtersTemplate}
      </Dialog>

      {formVisible && (
        <Dialog
          header={`${selectedRow ? "Edit" : "Create"}`}
          visible
          draggable={false}
          resizable={false}
          onHide={() => setFormVisible(false)}
        >
          {formTemplate && (
            <formTemplate.type {...formTemplate.props} row={selectedRow} />
          )}
        </Dialog>
      )}
    </CrudTableContextProvider>
  );
};

CrudTable.Table = Table;
CrudTable.Actions = Actions;
CrudTable.Filters = Filters;
CrudTable.Header = Header;
CrudTable.Form = Form;
