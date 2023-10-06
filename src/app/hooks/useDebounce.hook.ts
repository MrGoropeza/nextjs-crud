import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, timeout: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
