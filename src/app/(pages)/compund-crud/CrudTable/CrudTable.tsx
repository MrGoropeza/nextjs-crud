"use client";

import { Pencil, Trash } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ReactElement, ReactNode, useState } from "react";
import { BaseApi, ListResponse } from "../services/todo.api";
import { Actions, ActionsProps } from "./components/Actions";
import Header, {
  CrudTableDefaultHeaderTemplate,
  HeaderProps,
} from "./components/Header";
import Table, { TableProps } from "./components/Table";
import { CrudTableContextProvider } from "./context/CrudTableContext";

interface CrudTableProps {
  children: Array<
    | ReactElement<TableProps>
    | ReactElement<ActionsProps>
    | ReactElement<FiltersProps>
    | ReactElement<HeaderProps>
  >;
  data: ListResponse<any>;
  api: BaseApi;
}

interface FiltersProps {
  children?: ReactNode;
}

export const CrudTable = ({ data, children }: CrudTableProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const defaultHeaderTemplate = (
    <CrudTableDefaultHeaderTemplate
      onCreate={() => {}}
      onFilter={() => setFiltersVisible(true)}
      onSearch={() => {}}
    />
  );

  const defaultActionsTemplate = (row: any) => (
    <div className="flex gap-2">
      <Button
        severity="info"
        icon={<Pencil />}
        onClick={() => console.log("edit", row)}
      />
      <Button
        severity="danger"
        icon={<Trash />}
        onClick={() => console.log("delete", row)}
      />
    </div>
  );

  const tableTemplate = children.find((child) => child.type === Table);
  const headerTemplate =
    children.find((child) => child.type === Header) ?? defaultHeaderTemplate;
  const actionsTemplate = children.find((child) => child.type === Actions);
  const filtersTemplate = children.find((child) => child.type === Filters);

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
      : defaultActionsTemplate,
    filters: filtersTemplate,
    defaultActionsTemplate,
    defaultHeaderTemplate,
  };

  return (
    <CrudTableContextProvider value={{ data, filtersState, templates }}>
      {tableTemplate}

      <Dialog
        header="Filters"
        visible={filtersVisible}
        draggable={false}
        resizable={false}
        onHide={() => setFiltersVisible(false)}
      >
        {filtersTemplate}
      </Dialog>
    </CrudTableContextProvider>
  );
};

export const Filters = ({ children }: FiltersProps) => {
  return <>{children}</>;
};

CrudTable.Table = Table;
CrudTable.Actions = Actions;
CrudTable.Filters = Filters;
CrudTable.Header = Header;
