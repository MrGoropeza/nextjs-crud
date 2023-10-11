import { ReactNode } from "react";

interface Props {
  modal: ReactNode;
  children: ReactNode;
}

const SSRCRUDLayout = ({ children, modal }: Props) => {
  return (
    <>
      {children}

      {modal}
    </>
  );
};
export default SSRCRUDLayout;
