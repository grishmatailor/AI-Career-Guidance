"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userResolvers_1 = require("./userResolvers");
const careerResolvers_1 = require("./careerResolvers");
const questionResolvers_1 = require("./questionResolvers");
exports.resolvers = {
    Query: {
        ...userResolvers_1.userResolvers.Query,
        ...careerResolvers_1.careerResolvers.Query,
        ...questionResolvers_1.questionResolvers.Query,
    },
    Mutation: {
        ...userResolvers_1.userResolvers.Mutation,
        ...careerResolvers_1.careerResolvers.Mutation,
        ...questionResolvers_1.questionResolvers.Mutation,
    },
};
