"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils/apollo-client";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
      <Toaster richColors position="top-right" />
    </ApolloProvider>
  );
}
