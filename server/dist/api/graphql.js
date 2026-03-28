"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
exports.default = async (req, res) => {
    const { app } = await (0, index_1.startServer)();
    return app(req, res);
};
