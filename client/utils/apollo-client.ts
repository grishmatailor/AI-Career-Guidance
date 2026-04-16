import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:4002/graphql",
});

// Attach JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Global error handler
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (message === "Unauthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      if (message === "ACCOUNT_INACTIVE") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Account Deactivated", {
          description: "Your account has been deactivated. Please contact admin to activate it or create a new account.",
          duration: 5000,
        });
        window.location.href = "/login";
      }
    });
  }
  if (networkError) {
    console.error("Network error:", networkError);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
