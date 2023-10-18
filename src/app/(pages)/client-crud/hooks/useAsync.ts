import { DependencyList, useCallback, useEffect, useState } from "react";

interface Props<T, Args extends unknown[]> {
  asyncFn: (...args: Args) => Promise<T>;
  args: Args;
  deps: DependencyList;
  fetchOnMount?: boolean;
}

export const useAsync = <T, Args extends unknown[]>({
  asyncFn,
  args,
  deps,
  fetchOnMount = true,
}: Props<T, Args>) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<unknown | null>(null);
  const [canFetch, setCanFetch] = useState(fetchOnMount);

  const fetchData = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        setError(null);

        const data = await asyncFn(...args);

        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [asyncFn],
  );

  // en dev, el fetch se realiza dos veces al inicio (react strict mode)
  useEffect(() => {
    if (!canFetch) {
      setCanFetch(true);
      return;
    }

    fetchData(...args);
  }, deps);

  return { data, loading, error, fetchData };
};
