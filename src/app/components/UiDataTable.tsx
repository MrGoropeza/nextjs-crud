import {
  DataTable,
  DataTableProps,
  DataTableValueArray,
} from "primereact/datatable";

type Props<T extends DataTableValueArray> = {} & DataTableProps<T>;

const UiDataTable = <T extends DataTableValueArray>({ ...rest }: Props<T>) => {
  return <DataTable<T> {...rest} />;
};

export default UiDataTable;
