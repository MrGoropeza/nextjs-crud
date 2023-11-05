import { createContext, useContext } from "react";
import { ListPageCriteria, ListPageResponse } from "../../models/list.model";

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
  formState: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    closable: boolean;
    setClosable: (closable: boolean) => void;
  };
  crudActions: {
    onCreate: () => void;
    onFilter: () => void;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
  };
  data: ListPageResponse<any>;
  criteria: ListPageCriteria;
}

export const CrudTableContext = createContext<CrudTableContextValue>({
  filtersState: {
    visible: false,
    setVisible: () => {},
  },
  formState: {
    visible: false,
    setVisible: () => {},
    closable: true,
    setClosable: () => {},
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
    data: [],
    count: 0,
    start: 0,
    length: 5,
  },
  criteria: {
    start: 0,
    length: 5,
    query: {
      filters: [],
      sorts: [],
      search: "",
    },
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
