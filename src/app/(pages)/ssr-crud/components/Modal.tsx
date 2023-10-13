"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { ReactNode } from "react";
import { Todo } from "../types/todo.type";

interface Props {
  children?: ReactNode;
  todo?: Todo;
}

const Modal = ({ children, todo }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const shouldShowModal = pathname.includes("/ssr-crud/");
  if (!shouldShowModal) return null;

  const handleHide = async () => {
    await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
    await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud/[id]`);
    router.push(`/ssr-crud?${searchParams.toString()}`);
  };

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
