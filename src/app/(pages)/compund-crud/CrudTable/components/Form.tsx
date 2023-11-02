import { ReactNode } from "react";

export interface FormProps {
  row?: any;
  children: (row?: any) => ReactNode;
}

const Form = ({ row, children }: FormProps) => {
  return children(row);
};
export default Form;
