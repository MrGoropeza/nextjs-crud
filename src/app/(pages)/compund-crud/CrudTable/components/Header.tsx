import { Filter, Plus } from "lucide-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactNode } from "react";
import { useCrudTableContext } from "../context/CrudTableContext";

interface DefaultHeaderProps {
  onCreate: () => void;
  onFilter: () => void;
  onSearch: () => void;
}

export const CrudTableDefaultHeaderTemplate = ({
  onCreate,
  onFilter,
  onSearch,
}: DefaultHeaderProps) => {
  return (
    <header className="grid grid-cols-[auto_1fr_auto_auto] gap-4">
      <Button
        label="Create"
        severity="success"
        icon={<Plus />}
        onClick={onCreate}
      />

      <Button className="col-[3]" icon={<Filter />} onClick={onFilter} />

      <InputText className="col-[4]" placeholder="Search..." />
    </header>
  );
};

export interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const {
    templates: { defaultHeaderTemplate },
  } = useCrudTableContext();

  return <>{children ?? defaultHeaderTemplate}</>;
};
export default Header;
