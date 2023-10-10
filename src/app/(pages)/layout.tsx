"use client";

import { QueryClient } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const PagesLayout = ({ children }: Props) => {
  return (
    // <QueryClientProvider client={queryClient}>
    <>{children}</>
    // </QueryClientProvider>
  );
};

export default PagesLayout;
