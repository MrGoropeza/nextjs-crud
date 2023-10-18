import { ReactNode } from "react";
import ToastContextProvider from "./context/toast.context";

interface Props {
  children?: ReactNode;
}

const ClientCRUDLayout = ({ children }: Props) => {
  return <ToastContextProvider>{children}</ToastContextProvider>;
};
export default ClientCRUDLayout;
