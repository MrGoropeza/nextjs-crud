import { Filter, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonProps } from "primereact/button";
import { InputText, InputTextProps } from "primereact/inputtext";
import {
  ChangeEvent,
  ComponentProps,
  ReactNode,
  useRef,
  useState,
} from "react";
import { QueryCriteria } from "../../models/list.model";
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
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const { criteria } = useCrudTableContext();
  const searchParams = new URLSearchParams(urlSearchParams);

  const debouncingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState(criteria.query.search ?? "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debouncingTimeout.current) clearTimeout(debouncingTimeout.current);

    // Debounce Timer
    debouncingTimeout.current = setTimeout(() => {
      const newCriteria: QueryCriteria = {
        ...criteria.query,
        search: e.target.value,
      };

      searchParams.set("query", btoa(JSON.stringify(newCriteria)));

      router.replace(`${pathname}?${searchParams.toString()}`);
    }, 600); // Debounce Delay
  };

  return (
    <InputText
      placeholder="Search..."
      {...rest}
      value={search}
      onChange={handleChange}
    />
  );
};

Header.CreateButton = CreateButton;
Header.FiltersButton = FiltersButton;
Header.SearchInput = SearchInput;

export default Header;
