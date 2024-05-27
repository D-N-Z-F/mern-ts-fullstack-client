"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChildrenProps } from "./layout";

export default function ReactQueryProvider({ children }: ChildrenProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
