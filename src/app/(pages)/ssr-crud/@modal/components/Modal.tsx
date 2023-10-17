"use client";

import { useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { ReactNode } from "react";
import { Todo } from "../../models/todo.type";
import { useModalHide } from "../hooks/useModalHide";

interface Props {
  children?: ReactNode;
  todo?: Todo;
}

const Modal = ({ children, todo }: Props) => {
  const handleHide = useModalHide();

  const searchParams = useSearchParams();

  const shouldShowModal = searchParams.has("id");
  if (!shouldShowModal) return null;

  return (
    <Dialog
      header={`${todo ? `Edit "${todo.title}"` : "Add Todo"} `}
      visible
      resizable={false}
      draggable={false}
      onHide={handleHide}
    >
      {children}
    </Dialog>
  );
};
export default Modal;
