import Await from "@app/components/Await";
import { Suspense } from "react";
import SSRCrudTable from "./components/Table";
import TableSkeleton from "./components/TableSkeleton";
import { getTodos } from "./services/todo.service";

export const fetchCache = "force-no-store";

type Props = {
  searchParams: { [key: string]: string };
};

const SSRCRUDPage = ({ searchParams }: Props) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const page = +(urlSearchParams.get("page") ?? 1);
  const rows = +(urlSearchParams.get("rows") ?? 5);
  const sortField = urlSearchParams.get("sortField");
  const sortOrder = urlSearchParams.get("sortOrder") === "desc" ? -1 : 1;

  const todosPromise = getTodos({
    page,
    rows,
    sort: sortField ? `${sortOrder === 1 ? "+" : "-"}${sortField}` : undefined,
  });

  return (
    <section className="p-8">
      <Suspense
        key={Math.random()}
        fallback={
          <TableSkeleton
            rows={rows}
            page={page}
            sortField={sortField ?? undefined}
            sortOrder={sortOrder}
          />
        }
      >
        <Await promise={todosPromise}>
          {(data) => {
            const first = data.rows * (data.page - 1);

            return (
              <SSRCrudTable
                data={data.records}
                rows={data.rows}
                first={first}
                totalRecords={data.totalRecords}
                sortField={sortField ?? undefined}
                sortOrder={sortOrder}
              />
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
};

export default SSRCRUDPage;
