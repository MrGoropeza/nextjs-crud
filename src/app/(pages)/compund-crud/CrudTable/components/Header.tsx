import { Filter, Plus } from "lucide-react";
import { Button, ButtonProps } from "primereact/button";
import { InputText, InputTextProps } from "primereact/inputtext";
import { ComponentProps, ReactNode } from "react";
import {
  CrudTableContextValue,
  useCrudTableContext,
} from "../context/CrudTableContext";

export interface HeaderProps
  extends Omit<ComponentProps<"header">, "children"> {
  children: ReactNode | ((ctx: CrudTableContextValue) => ReactNode);
}

const Header = ({ children, ...rest }: HeaderProps) => {
  const context = useCrudTableContext();

  return (
    <header {...rest}>
      {typeof children === "function" ? children(context) : children}
    </header>
  );
};

const CreateButton = ({ ...rest }: ButtonProps) => {
  const {
    crudActions: { onCreate },
  } = useCrudTableContext();

  return (
    <Button
      label="Create"
      icon={<Plus />}
      severity="success"
      {...rest}
      onClick={onCreate}
    />
  );
};

const FiltersButton = ({ ...rest }: ButtonProps) => {
  const {
    crudActions: { onFilter },
  } = useCrudTableContext();

  return <Button icon={<Filter />} {...rest} onClick={onFilter} />;
};

const SearchInput = ({ ...rest }: InputTextProps) => {
  const {
    crudActions: {},
  } = useCrudTableContext();
  return <InputText placeholder="Search..." {...rest} />;
};

Header.CreateButton = CreateButton;
Header.FiltersButton = FiltersButton;
Header.SearchInput = SearchInput;

export default Header;
