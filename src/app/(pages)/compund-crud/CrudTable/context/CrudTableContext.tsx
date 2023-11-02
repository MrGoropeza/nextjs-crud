import { createContext, useContext } from "react";
import { ListResponse } from "../../services/todo.api";

interface CrudTableContextValue {
  templates: {
    header?: React.ReactNode;
    actions?: (row: any) => React.ReactNode;
    filters?: React.ReactNode;
    defaultHeaderTemplate: React.ReactNode;
    defaultActionsTemplate: (row: any) => React.ReactNode;
  };
  filtersState: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  };
  data: ListResponse<any>;
}

export const CrudTableContext = createContext<CrudTableContextValue>({
  filtersState: {
    visible: false,
    setVisible: () => {},
  },
  templates: {
    defaultHeaderTemplate: <></>,
    defaultActionsTemplate: () => <></>,
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
