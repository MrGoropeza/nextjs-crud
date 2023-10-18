import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "primereact/button";
import {
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableSortMeta,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAsync } from "../hooks/useAsync";
import { useDebounce } from "../hooks/useDebounce";
import { BaseModel } from "../models/interfaces/base.interface";
import {
  ListPageCriteria,
  SortCriterion,
} from "../models/interfaces/list-criteria.interface";
import { BaseApiType } from "../services/base.service";

interface CrudTableLazyState<Model> {
  value: Model[];
  first: number;
  rows: number;
  totalRecords: number;
  loading: boolean;
  onPage: (e: DataTablePageEvent) => void;
  onSort: (e: DataTableSortEvent) => void;
  multiSortMeta: DataTableSortMeta[];
  sortMode: "multiple";
  paginator: true;
  lazy: true;
  removableSort: true;
  header: () => ReactNode;
  emptyMessage: () => ReactNode;
}

interface CrudTableModalState {
  id?: string | number;
  dialogVisible: boolean;
  setDialogVisible: Dispatch<SetStateAction<boolean>>;
}

interface ChildrenProps<Model> {
  tableState: CrudTableLazyState<Model>;
  modalState: CrudTableModalState;
  criteria: ListPageCriteria;
  setCriteria: Dispatch<SetStateAction<ListPageCriteria>>;
  error: unknown | null;
  defaultActionsTemplate: (data: Model) => ReactNode;
  refreshTable: () => void;
}

interface Props<Model extends BaseModel> {
  api: BaseApiType<Model>;
  children: (props: ChildrenProps<Model>) => ReactNode;
  initialState?: ListPageCriteria;
}

const INITIAL_STATE: ListPageCriteria = {
  start: 0,
  length: 5,
  query: { filters: [], sorts: [], search: "" },
};

interface CrudTableContextValue {
  modalState: CrudTableModalState;
  criteria: ListPageCriteria;
  setCriteria: Dispatch<SetStateAction<ListPageCriteria>>;
  refreshTable: () => void;
}

export const CrudTableContext = createContext<CrudTableContextValue>({
  modalState: {
    dialogVisible: false,
    setDialogVisible: () => {},
  },
  criteria: INITIAL_STATE,
  setCriteria: () => {},
  refreshTable: () => {},
});

export const useCrudTableContext = () => useContext(CrudTableContext);

export const CrudTable = <Model extends BaseModel>({
  api,
  children,
  initialState = INITIAL_STATE,
}: Props<Model>) => {
  const [criteria, setCriteria] = useState<ListPageCriteria>(initialState);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [id, setId] = useState<string>();

  const handlePage = (e: DataTablePageEvent) => {
    setCriteria((prev) => ({
      ...prev,
      start: e.first,
      length: e.rows,
    }));
  };

  const handleSort = (e: DataTableSortEvent) => {
    const sorts =
      e.multiSortMeta?.map<SortCriterion>((meta) => ({
        propertyName: meta.field,
        descending: meta.order === -1,
      })) ?? [];

    setCriteria((prev) => ({ ...prev, query: { ...prev.query, sorts } }));
  };

  useEffect(() => {
    setCriteria((prev) => ({
      ...prev,
      query: { ...prev.query, search: debouncedSearch ?? "" },
    }));
  }, [debouncedSearch]);

  const { data, loading, error, fetchData } = useAsync({
    asyncFn: api.list,
    args: [criteria],
    deps: [
      criteria.start,
      criteria.length,
      criteria.query.search,
      criteria.query.sorts,
      criteria.query.filters,
    ], // para evitar varios fetchs iniciales innecesarios}
  });

  const refreshTable = () => {
    fetchData(criteria);
  };

  const defaultHeaderTemplate = () => (
    <header className="grid grid-cols-[auto_1fr_auto] gap-4">
      <Button
        label="Create"
        severity="success"
        icon={<Plus />}
        onClick={() => {
          setId(undefined);
          setDialogVisible(true);
        }}
      />
      <InputText
        className="col-[3]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
    </header>
  );

  const defaultEmptyTemplate = () => {
    if (!error) return "No data";

    return (
      <div className="flex flex-col items-center gap-4">
        <p>Error fetching data</p>
        <Button
          label="Try again"
          severity="danger"
          onClick={() => fetchData(criteria)}
        />
      </div>
    );
  };

  const defaultActionsTemplate = (data: Model) => {
    return (
      <div className="flex gap-2">
        <Button
          severity="info"
          icon={<Pencil />}
          onClick={() => {
            setId(`${data.id}`);
            setDialogVisible(true);
          }}
        />
        <Button
          severity="danger"
          icon={<Trash />}
          onClick={() => setDialogVisible(true)}
        />
      </div>
    );
  };

  const multiSortMeta = criteria.query.sorts.map<DataTableSortMeta>((sort) => ({
    field: sort.propertyName,
    order: sort.descending ? -1 : 1,
  }));

  const tableState: CrudTableLazyState<Model> = {
    value: data?.data ?? [],
    first: data?.start ?? 0,
    rows: data?.length ?? INITIAL_STATE.length,
    totalRecords: data?.count ?? 0,
    loading,
    onPage: handlePage,
    onSort: handleSort,
    multiSortMeta: multiSortMeta,
    sortMode: "multiple",
    paginator: true,
    lazy: true,
    removableSort: true,
    header: defaultHeaderTemplate,
    emptyMessage: defaultEmptyTemplate,
  };

  const modalState: CrudTableModalState = {
    id,
    dialogVisible,
    setDialogVisible,
  };

  return (
    <CrudTableContext.Provider
      value={{
        modalState,
        criteria,
        setCriteria,
        refreshTable,
      }}
    >
      {children({
        tableState,
        modalState,
        error,
        defaultActionsTemplate,
        criteria,
        setCriteria,
        refreshTable,
      })}
    </CrudTableContext.Provider>
  );
};
