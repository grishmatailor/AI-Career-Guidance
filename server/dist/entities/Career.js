"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Career = void 0;
const typeorm_1 = require("typeorm");
const Recommendation_1 = require("./Recommendation");
let Career = class Career {
};
exports.Career = Career;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Career.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Career.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Career.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Career.prototype, "skills_required", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Career.prototype, "salary_range", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Career.prototype, "growth_rate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Recommendation_1.Recommendation, (recommendation) => recommendation.career),
    __metadata("design:type", Array)
], Career.prototype, "recommendations", void 0);
exports.Career = Career = __decorate([
    (0, typeorm_1.Entity)("careers")
], Career);
