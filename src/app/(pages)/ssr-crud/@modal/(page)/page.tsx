import { getTodo } from "@app/(pages)/ssr-crud/services/todo.service";
import Await from "@app/components/Await";
import { Suspense } from "react";
import ModalSkeleton from "../../components/ModalSkeleton";
import SSRCrudForm from "../components/Form";
import Modal from "../components/Modal";

interface Props {
  searchParams: { [key: string]: string };
}

const SSRCRUDEditPage = ({ searchParams }: Props) => {
  const todoPromise =
    searchParams.id && searchParams.id !== "create"
      ? getTodo(searchParams.id)
      : new Promise<undefined>((resolve) => resolve(undefined));

  return (
    <Suspense
      fallback={<ModalSkeleton loadingText="Loading Todo..." />}
      key={Math.random()}
    >
      <Await promise={todoPromise}>
        {(todo) => (
          <Modal todo={todo}>
            <SSRCrudForm todo={todo} />
          </Modal>
        )}
      </Await>
    </Suspense>
  );
};
export default SSRCRUDEditPage;
