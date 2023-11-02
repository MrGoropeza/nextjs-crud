import { ReactNode } from "react";

export interface ActionsProps {
  row?: any;
  children: (row: any) => ReactNode;
}

export const Actions = ({ row, children }: ActionsProps) => {
  return children(row);
};
