import { createContext, useContext } from "react";
import { ListResponse } from "../../services/todo.api";

export interface CrudTableContextValue {
  templates: {
    header: React.ReactNode;
    actions: (row: any) => React.ReactNode;
    filters?: React.ReactNode;
  };
  filtersState: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  };
  crudActions: {
    onCreate: () => void;
    onFilter: () => void;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
  };
  data: ListResponse<any>;
}

export const CrudTableContext = createContext<CrudTableContextValue>({
  filtersState: {
    visible: false,
    setVisible: () => {},
  },
  templates: {
    header: <></>,
    actions: () => <></>,
  },
  crudActions: {
    onEdit: () => {},
    onDelete: () => {},
    onCreate: () => {},
    onFilter: () => {},
  },
  data: {
    items: [],
    page: 1,
    perPage: 5,
    totalItems: 0,
    totalPages: 0,
  },
});

export const useCrudTableContext = () => useContext(CrudTableContext);

interface Props {
  children?: React.ReactNode;
  value: CrudTableContextValue;
}

export const CrudTableContextProvider = ({ value, children }: Props) => {
  return (
    <CrudTableContext.Provider value={value}>
      {children}
    </CrudTableContext.Provider>
  );
};
