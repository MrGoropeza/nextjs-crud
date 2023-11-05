import { ReactNode } from "react";
import ToastContextProvider from "../ssr-crud/context/toast.context";

interface Props {
  children: ReactNode;
}

const CompundCrudLayout = ({ children }: Props) => {
  return <ToastContextProvider>{children}</ToastContextProvider>;
};
export default CompundCrudLayout;
