interface Props<T> {
  promise: Promise<T>;
  children: (value: T) => JSX.Element;
}

const Await = async <T,>({ promise, children }: Props<T>) => {
  try {
    const data = await promise;
    return children(data);
  } catch (error) {
    throw error;
  }
};
export default Await;
