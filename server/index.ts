import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { initializeDatabase } from "./config/database";
import { seedData } from "./config/seed";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { authMiddleware } from "./middleware/auth";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Initialize Database
  await initializeDatabase();
  await seedData();

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1] || "";
        const user = authMiddleware(token);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4002;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
