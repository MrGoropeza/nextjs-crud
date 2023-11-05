import CompoundTable from "./CompundTable";
import { useCrudCriteria } from "./hooks/useCrudCriteria";
import { UtherTodo } from "./models/todo.model";
import { ApiEndpoints, BaseApi } from "./services/base.api";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { [key: string]: string };
}

const CompoundPage = async ({ searchParams }: Props) => {
  const { list } = BaseApi<UtherTodo>(ApiEndpoints.Todos);

  const criteria = useCrudCriteria(searchParams);

  const response = await list(criteria);

  return (
    <section className="p-8">
      <CompoundTable data={response} />
    </section>
  );
};
export default CompoundPage;
