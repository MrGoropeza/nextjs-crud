import CompoundTable from "./CompundTable";
import { ListPageCriteria } from "./models/list.model";
import { UtherTodo } from "./models/todo.model";
import { ApiEndpoints, BaseApi } from "./services/base.api";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { [key: string]: string };
}

const CompoundPage = async ({ searchParams }: Props) => {
  const { list } = BaseApi<UtherTodo>(ApiEndpoints.Todos);

  const params = new URLSearchParams(searchParams);

  const page = +(params.get("page") ?? 1);
  const rows = +(params.get("rows") ?? 5);

  const query: ListPageCriteria = {
    start: (page - 1) * rows,
    length: rows,
    query: { sorts: [], filters: [], search: "" },
  };

  const response = await list(query);

  return (
    <section className="p-8">
      <CompoundTable data={response} query={query} />

      {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
    </section>
  );
};
export default CompoundPage;
