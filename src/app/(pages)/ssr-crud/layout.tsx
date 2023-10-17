import { ReactNode } from "react";
import ToastContextProvider from "./context/toast.context";

interface Props {
  modal: ReactNode;
  children: ReactNode;
}

const SSRCRUDLayout = ({ children, modal }: Props) => {
  return (
    <ToastContextProvider>
      {children} {modal}
    </ToastContextProvider>
  );
};
export default SSRCRUDLayout;
