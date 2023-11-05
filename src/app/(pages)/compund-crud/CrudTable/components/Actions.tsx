"use client";

import { Pencil, Trash } from "lucide-react";
import { Button, ButtonProps } from "primereact/button";
import { ComponentProps, ReactNode } from "react";
import {
  CrudTableContextValue,
  useCrudTableContext,
} from "../context/CrudTableContext";

export interface ActionsProps<T>
  extends Omit<ComponentProps<"div">, "children"> {
  row?: T;
  children: (row: T, context: CrudTableContextValue) => ReactNode;
}

const Actions = <T extends unknown = any>({
  row,
  children,
  ...rest
}: ActionsProps<T>) => {
  const context = useCrudTableContext();

  return <div {...rest}>{children(row ?? ({} as T), context)}</div>;
};

const EditButton = ({ ...rest }: ButtonProps) => {
  return <Button severity="info" icon={<Pencil />} {...rest} />;
};

const DeleteButton = ({ ...rest }: ButtonProps) => {
  return <Button severity="danger" icon={<Trash />} {...rest} />;
};

Actions.EditButton = EditButton;
Actions.DeleteButton = DeleteButton;

export default Actions;
