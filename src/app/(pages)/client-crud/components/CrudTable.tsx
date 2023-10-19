import { AlertTriangle, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableSortMeta,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { PaginatorTemplate } from "primereact/paginator";
import { classNames } from "primereact/utils";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "../context/toast.context";
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
  paginatorTemplate: PaginatorTemplate;
  rowsPerPageOptions: number[];
}

interface CrudTableModalState {
  id?: string | number;
  dialogVisible: boolean;
  setDialogVisible: Dispatch<SetStateAction<boolean>>;
}

interface CrudTableSearchState {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
}

interface ChildrenProps<Model> {
  tableState: CrudTableLazyState<Model>;
  modalState: CrudTableModalState;
  searchState: CrudTableSearchState;
  criteria: ListPageCriteria;
  setCriteria: Dispatch<SetStateAction<ListPageCriteria>>;
  error: unknown | null;
  defaultActionsTemplate: (data: Model) => ReactNode;
  refreshTable: () => void;
  handleCreate: () => void;
  handleDelete: (id: string | number) => void;
  handleEdit: (id: string | number) => void;
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
  const { showSuccess, showError } = useToast();

  const [criteria, setCriteria] = useState<ListPageCriteria>(initialState);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleCreate = () => {
    setId(undefined);
    setDialogVisible(true);
  };

  const handleEdit = (id: string | number) => {
    setId(`${id}`);
    setDialogVisible(true);
  };

  const handleDelete = (id: string | number) => {
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Confirm",
      icon: <AlertTriangle />,
      accept: () => {
        setIsDeleting(true);

        api
          .deleteOne(`${id}`)
          .then(() => {
            showSuccess("Deleted successfully");
            refreshTable();
          })
          .catch(() => showError("Error while deleting. Please try again."))
          .finally(() => setIsDeleting(false));
      },
    });
  };

  const defaultActionsTemplate = (data: Model) => {
    return (
      <div className="flex gap-2">
        <Button
          severity="info"
          icon={<Pencil />}
          onClick={() => handleEdit(data.id)}
        />
        <Button
          severity="danger"
          icon={<Trash />}
          onClick={() => handleDelete(data.id)}
        />
      </div>
    );
  };

  const defaultHeaderTemplate = () => (
    <header className="grid grid-cols-[auto_1fr_auto] gap-4">
      <Button
        label="Create"
        severity="success"
        icon={<Plus />}
        onClick={handleCreate}
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

  const multiSortMeta = criteria.query.sorts.map<DataTableSortMeta>((sort) => ({
    field: sort.propertyName,
    order: sort.descending ? -1 : 1,
  }));

  const tableState: CrudTableLazyState<Model> = {
    value: data?.data ?? [],
    first: data?.start ?? 0,
    rows: data?.length ?? INITIAL_STATE.length,
    totalRecords: data?.count ?? 0,
    loading: loading || isDeleting,
    onPage: handlePage,
    onSort: handleSort,
    multiSortMeta: multiSortMeta,
    sortMode: "multiple",
    paginator: true,
    lazy: true,
    removableSort: true,
    header: defaultHeaderTemplate,
    emptyMessage: defaultEmptyTemplate,
    paginatorTemplate: {
      layout:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
      PageLinks: (options) => {
        if (
          (options.view.startPage === options.page &&
            options.view.startPage !== 0) ||
          (options.view.endPage === options.page &&
            options.page + 1 !== options.totalPages)
        ) {
          const className = classNames(options.className, {
            "p-disabled": true,
          });

          return (
            <span className={className} style={{ userSelect: "none" }}>
              ...
            </span>
          );
        }

        return (
          <button
            type="button"
            className={options.className}
            onClick={options.onClick}
          >
            {options.page + 1}
          </button>
        );
      },
    },
    rowsPerPageOptions: [5, 10, 15],
  };

  const modalState: CrudTableModalState = {
    id,
    dialogVisible,
    setDialogVisible,
  };

  const searchState: CrudTableSearchState = {
    search,
    setSearch,
    debouncedSearch: debouncedSearch ?? "",
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
        searchState,
        error,
        defaultActionsTemplate,
        criteria,
        setCriteria,
        refreshTable,
        handleCreate,
        handleDelete,
        handleEdit,
      })}

      <ConfirmDialog />
    </CrudTableContext.Provider>
  );
};
