interface Props<T> {
  promise: Promise<T>;
  children: (value: T) => JSX.Element;
}

const Await = async <T,>({ promise, children }: Props<T>) => {
  const data = await promise;

  return children(data);
};
export default Await;
