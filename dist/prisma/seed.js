"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var prisma_client_1 = __importDefault(require("./prisma-client"));
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // eslint-disable-next-line no-console
                console.log('Seeding Database');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                console.log('Creating planeTrip data...');
                return [4 /*yield*/, prisma_client_1.default.planeTrip.createMany({
                        data: [
                            {
                                origin: 'HKG',
                                destination: 'NRT',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 01:25", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 270,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                origin: 'NRT',
                                destination: 'TPE',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 08:39", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 230,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                origin: 'TPE',
                                destination: 'HKG',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 13:50", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 120,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            // section 2
                            {
                                origin: 'CTS',
                                destination: 'HKG',
                                departureTime: moment_timezone_1.default.tz("2024-01-01 21:00", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 450,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                origin: 'HKG',
                                destination: 'NGO',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 09:11", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 240,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                origin: 'NGO',
                                destination: 'HKG',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 17:34", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 240,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            // section 3
                            {
                                origin: 'YVR',
                                destination: 'HKG',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 02:00", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 750,
                                planeId: 'PlaneC',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                origin: 'HKG',
                                destination: 'NRT',
                                departureTime: moment_timezone_1.default.tz("2024-01-02 19:00", "UTC").tz("Asia/Shanghai").toDate(),
                                flightTime: 240,
                                planeId: 'PlaneC',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                        ],
                    })];
            case 2:
                _a.sent();
                console.log('Flight data created.');
                console.log('Creating groundTime data...');
                return [4 /*yield*/, prisma_client_1.default.groundTime.createMany({
                        data: [
                            {
                                destination: 'HKG',
                                groundTime: moment_timezone_1.default.tz("2024-01-01 21:00", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 265,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'NRT',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 05:55", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 164,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'TPE',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 12:29", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 81,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'HKG',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 15:50", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 600,
                                planeId: 'PlaneA',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'HKG',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 04:30", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 281,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'NGO',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 13:11", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 263,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'HKG',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 21:34", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 300,
                                planeId: 'PlaneB',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'YVB',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 23:30", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 150,
                                planeId: 'PlaneC',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'HKG',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 14:30", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 270,
                                planeId: 'PlaneC',
                                createdAt: new Date(),
                                deletedAt: null,
                            }, {
                                destination: 'NRT',
                                groundTime: moment_timezone_1.default.tz("2024-01-02 23:00", "UTC").tz("Asia/Shanghai").toDate(),
                                duration: 150,
                                planeId: 'PlaneC',
                                createdAt: new Date(),
                                deletedAt: null,
                            },
                        ],
                    })];
            case 3:
                _a.sent();
                console.log('Ground Time data created.');
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('Error creating planeTrip data:', error_1);
                return [3 /*break*/, 5];
            case 5:
                // eslint-disable-next-line no-console
                console.log('Seeding Completed');
                return [4 /*yield*/, prisma_client_1.default.$disconnect()];
            case 6:
                _a.sent(); // 关闭数据库连接
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (error) {
    // eslint-disable-next-line no-console
    console.warn('Error While generating Seed: \n', error);
    prisma_client_1.default.$disconnect(); // 确保在发生错误时也关闭数据库连接
});
