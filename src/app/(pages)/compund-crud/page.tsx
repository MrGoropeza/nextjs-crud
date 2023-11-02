import CompoundTable from "./CompundTable";
import { ListPageCriteria } from "./CrudTable/models/list.model";
import { TodoApi } from "./services/todo.api";

interface Props {
  searchParams: { [key: string]: string };
}

const CompoundPage = async ({ searchParams }: Props) => {
  const { list } = TodoApi();

  const params = new URLSearchParams(searchParams);

  const page = +(params.get("page") ?? 1);
  const rows = +(params.get("rows") ?? 5);

  const query: ListPageCriteria = {
    start: (page - 1) * rows,
    length: rows,
    query: { sorts: [], filters: [], search: "" },
  };

  const response = await list(page, rows, []);

  return (
    <section className="p-8">
      <CompoundTable data={response} query={query} />

      {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
    </section>
  );
};
export default CompoundPage;
