"use client";
import { useEffect } from "react";
import { useToast } from "../context/toast.context";
import { useModalHide } from "./hooks/useModalHide";

// Error components must be Client Components

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  const { showError } = useToast();
  const hideModal = useModalHide();

  useEffect(() => {
    showError("Todo not found");
    hideModal();
    setTimeout(reset, 500);
  }, []);

  return <></>;
}
