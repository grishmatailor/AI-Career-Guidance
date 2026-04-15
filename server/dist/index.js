"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const database_1 = require("./config/database");
const seed_1 = require("./config/seed");
const migrate_1 = require("./config/migrate");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const auth_1 = require("./middleware/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function startServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    // Initialize Database
    await (0, database_1.initializeDatabase)();
    await (0, migrate_1.migrateDatabase)();
    await (0, seed_1.seedData)();
    // Apollo Server setup
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    app.use("/graphql", (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const token = req.headers.authorization?.split(" ")[1] || "";
            const user = (0, auth_1.authMiddleware)(token);
            return { user };
        },
    }));
    const PORT = process.env.PORT || 4002;
    if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
        await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    }
    return { app, server, httpServer };
}
if (require.main === module) {
    startServer().catch((err) => {
        console.error("Error starting server:", err);
    });
}
