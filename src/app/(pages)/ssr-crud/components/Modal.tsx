"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { ReactNode } from "react";
import { Todo } from "../types/todo.type";

interface Props {
  children?: ReactNode;
  todo: Todo;
  maximized?: boolean;
}

const Modal = ({ children, todo, maximized }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const shouldShowModal = pathname.includes("/ssr-crud/");
  if (!shouldShowModal) return null;

  return (
    <Dialog
      header={`Edit "${todo.title}"`}
      visible
      maximized={maximized}
      onHide={() => router.push(`/ssr-crud?${searchParams.toString()}`)}
    >
      {children}
    </Dialog>
  );
};
export default Modal;
