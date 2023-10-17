import { useRouter, useSearchParams } from "next/navigation";

export const useModalHide = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("id");

    router.replace(`/ssr-crud?${newSearchParams.toString()}`);
    router.refresh();
  };
};
