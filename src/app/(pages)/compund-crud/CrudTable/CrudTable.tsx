"use client";

import { AlertTriangle } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { ReactElement, useState } from "react";
import { ListPageCriteria, ListPageResponse } from "../models/list.model";
import { BaseApi } from "../services/todo.api";
import Actions, { ActionsProps } from "./components/Actions";
import Filters, { FiltersProps } from "./components/Filters/Filters";
import Form, { FormProps } from "./components/Form";
import Header, { HeaderProps } from "./components/Header";
import Table, { TableProps } from "./components/Table";
import { CrudTableContextProvider } from "./context/CrudTableContext";

interface CrudTableProps {
  children: ReactElement<
    TableProps | ActionsProps | FiltersProps | HeaderProps | FormProps
  >[];
  data: ListPageResponse<any>;
  api: BaseApi;
  query: ListPageCriteria;
}

export const Crud = ({ data, query, api, children }: CrudTableProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [formClosable, setFormClosable] = useState(true);
  const [selectedRow, setSelectedRow] = useState<any>();

  const TableComponent = children.find((child) => child.type === Table);
  const HeaderComponent = children.find((child) => child.type === Header);
  const ActionsComponent = children.find((child) => child.type === Actions);
  const FiltersComponent = children.find((child) => child.type === Filters);
  const FormComponent = children.find((child) => child.type === Form);

  const filtersState = {
    visible: filtersVisible,
    setVisible: setFiltersVisible,
  };

  const formState = {
    visible: formVisible,
    setVisible: setFormVisible,
    closable: formClosable,
    setClosable: setFormClosable,
  };

  const templates = {
    header: HeaderComponent,
    actions: ActionsComponent
      ? (row: any) => (
          <ActionsComponent.type {...ActionsComponent.props} row={row} />
        )
      : () => <></>,
    filters: FiltersComponent,
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
      value={{ data, filtersState, templates, crudActions, formState }}
    >
      {TableComponent}

      <ConfirmDialog />

      <Dialog
        header="Filters"
        visible={filtersVisible}
        draggable={false}
        resizable={false}
        onHide={() => setFiltersVisible(false)}
      >
        {FiltersComponent}
      </Dialog>

      {formVisible && (
        <Dialog
          header={`${selectedRow ? "Edit" : "Create"}`}
          visible
          draggable={false}
          resizable={false}
          closable={formClosable}
          onHide={() => setFormVisible(false)}
        >
          {FormComponent && (
            <FormComponent.type {...FormComponent.props} row={selectedRow} />
          )}
        </Dialog>
      )}
    </CrudTableContextProvider>
  );
};

Crud.Table = Table;
Crud.Actions = Actions;
Crud.Filters = Filters;
Crud.Header = Header;
Crud.Form = Form;
