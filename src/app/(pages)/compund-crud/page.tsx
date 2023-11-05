import Await from "@app/components/Await";
import { Suspense } from "react";
import CompoundTable from "./CompoundTable";
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

  if (criteria.query.sorts.length === 0) {
    criteria.query.sorts = [{ propertyName: "todoId", descending: true }];
  }

  const listPromise = list(criteria);

  return (
    <section className="p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Await promise={listPromise}>
          {(data) => <CompoundTable data={data} criteria={criteria} />}
        </Await>
      </Suspense>
    </section>
  );
};
export default CompoundPage;
