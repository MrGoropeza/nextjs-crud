import Modal from "@app/(pages)/ssr-crud/components/Modal";
import { getTodo } from "@app/(pages)/ssr-crud/services/todo.service";
import Await from "@app/components/Await";
import { Suspense } from "react";
import ModalSkeleton from "../../components/ModalSkeleton";

interface Props {
  params: { id: string };
}

const SSRCRUDEditPage = async ({ params: { id } }: Props) => {
  const todoPromise = getTodo(id);

  return (
    <Suspense fallback={<ModalSkeleton />}>
      <Await promise={todoPromise}>{(todo) => <Modal todo={todo} />}</Await>
    </Suspense>
  );
};
export default SSRCRUDEditPage;
