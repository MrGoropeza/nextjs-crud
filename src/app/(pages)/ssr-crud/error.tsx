"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

// Error components must be Client Components

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
    reset();
  };

  return (
    <section className="flex flex-col gap-4 p-8">
      <h2>Something went wrong!</h2>

      <pre className="m-0 overflow-auto border-gray-500 bg-slate-800 p-4">
        {error.message}
      </pre>

      <Button
        className="self-end"
        label="Try again"
        severity="danger"
        onClick={handleRetry}
      />
    </section>
  );
}
