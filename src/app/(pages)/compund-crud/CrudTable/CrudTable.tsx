"use client";

import { useToast } from "@app/(pages)/ssr-crud/context/toast.context";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { ReactElement, useState } from "react";
import { ListPageResponse } from "../models/list.model";
import { BaseApiType } from "../services/base.api";
import Actions, { ActionsProps } from "./components/Actions";
import Filters, { FiltersProps } from "./components/Filters/Filters";
import Form, { FormProps } from "./components/Form";
import Header, { HeaderProps } from "./components/Header";
import Table, { TableProps } from "./components/Table";
import { CrudTableContextProvider } from "./context/CrudTableContext";

interface CrudTableProps<T> {
  children: ReactElement<
    TableProps | ActionsProps<T> | FiltersProps | HeaderProps | FormProps
  >[];
  data: ListPageResponse<T>;
  api: BaseApiType<T>;
  modelId: string & keyof T;
}

export const Crud = <T,>({
  data,
  api,
  modelId,
  children,
}: CrudTableProps<T>) => {
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  const [filtersVisible, setFiltersVisible] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [formClosable, setFormClosable] = useState(true);
  const [selectedRow, setSelectedRow] = useState<T>();

  const [deleteLoading, setDeleteLoading] = useState(false);

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
      ? (row: T) => (
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
  const handleEditButton = (row: T) => {
    setSelectedRow(row);
    setFormVisible(true);
  };
  const handleDeleteButton = (row: T) => {
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Confirm",
      icon: <AlertTriangle />,
      accept: () => {
        setDeleteLoading(true);

        api
          .deleteOne(`${row[modelId]}`)
          .then(() => {
            showSuccess("Deleted successfully");
            router.refresh();
          })
          .catch(() => showError("Error while deleting. Please try again."))
          .finally(() => setDeleteLoading(false));
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
