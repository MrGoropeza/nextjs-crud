import Modal from "@app/(pages)/ssr-crud/components/Modal";
import { getTodo } from "@app/(pages)/ssr-crud/services/todo.service";
import Await from "@app/components/Await";
import { Suspense } from "react";
import CrudForm from "../../components/Form";
import ModalSkeleton from "../../components/ModalSkeleton";

interface Props {
  params: { id: string };
}

const SSRCRUDEditPage = ({ params: { id } }: Props) => {
  const todoPromise =
    id !== "create"
      ? getTodo(id)
      : new Promise<undefined>((resolve) => resolve(undefined));

  return (
    <Suspense fallback={<ModalSkeleton />} key={Math.random()}>
      <Await promise={todoPromise}>
        {(todo) => (
          <Modal todo={todo}>
            <CrudForm todo={todo} />
          </Modal>
        )}
      </Await>
    </Suspense>
  );
};
export default SSRCRUDEditPage;
