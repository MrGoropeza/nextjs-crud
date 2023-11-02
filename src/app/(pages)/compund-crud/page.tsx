import CompoundTable from "./CompundTable";
import { TodoApi } from "./services/todo.api";

const CompoundPage = async () => {
  const { list } = TodoApi();

  const response = await list(2, 5, []);

  return (
    <>
      <CompoundTable data={response} />

      {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
    </>
  );
};
export default CompoundPage;
