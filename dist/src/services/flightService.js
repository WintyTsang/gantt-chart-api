"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroundTimes = exports.getTrips = void 0;
var moment_1 = __importDefault(require("moment"));
var bson_1 = require("bson");
var prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
// 获取指定时间范围内的航班数据
var getTrips = function (_a) {
    var planeIds = _a.planeIds, origin = _a.origin, destination = _a.destination;
    return __awaiter(void 0, void 0, void 0, function () {
        var filter, res, flightsByPlane, sortedFlightsByPlane;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filter = __assign(__assign(__assign({}, (planeIds && {
                        planeId: Array.isArray(planeIds) ? { in: planeIds } : planeIds,
                    })), (origin && {
                        origin: Array.isArray(origin) ? { in: origin } : origin,
                    })), (planeIds && {
                        destination: Array.isArray(destination) ? { in: destination } : destination,
                    }));
                    return [4 /*yield*/, prisma_client_1.default.flight.findMany({
                            where: __assign({}, filter),
                            orderBy: {
                                departureTime: 'asc',
                            },
                        })];
                case 1:
                    res = _b.sent();
                    flightsByPlane = res.reduce(function (acc, flight) {
                        if (!acc[flight.plane]) {
                            acc[flight.plane] = [];
                        }
                        acc[flight.plane].push(__assign(__assign({}, flight), { arrivalTime: (0, moment_1.default)(flight.departureTime).add(flight.flightTime, 'minutes').toDate() }));
                        return acc;
                    }, {});
                    sortedFlightsByPlane = Object.keys(flightsByPlane)
                        .sort()
                        .reduce(function (acc, plane) {
                        acc[plane] = flightsByPlane[plane];
                        return acc;
                    }, {});
                    return [2 /*return*/, sortedFlightsByPlane];
            }
        });
    });
};
exports.getTrips = getTrips;
var parseDateTime = function (dateTimeStr) {
    var _a = dateTimeStr.split(' '), date = _a[0], time = _a[1];
    var _b = date.split('-').map(Number), month = _b[0], day = _b[1];
    var _c = time.split(':').map(Number), hour = _c[0], minute = _c[1];
    return new Date(2024, month - 1, day, hour, minute); // 假定年份为 2025
};
var formatDateTime = function (date) {
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return month + "-" + day + " " + hours + ":" + minutes;
};
var calculateGroundTimes = function (data) {
    var result = {};
    var flattenTrips = Object.values(data).reduce(function (acc, val) { return acc.concat(val); }, []);
    var latestDepartureTrip = flattenTrips.reduce(function (latest, trip) {
        return new Date(trip.departureTime) > new Date(latest.departureTime) ? trip : latest;
    }, flattenTrips[0]);
    Object.entries(data).forEach(function (_a) {
        var plane = _a[0], trips = _a[1];
        var groundTimes = [];
        trips.forEach(function (currentTrip, i) {
            if (i < trips.length - 1) {
                var nextTrip = trips[i + 1];
                var currentEnd = parseDateTime(formatDateTime(currentTrip.departureTime));
                currentEnd.setMinutes(currentEnd.getMinutes() + currentTrip.flightTime);
                var nextStart = parseDateTime(formatDateTime(nextTrip.departureTime));
                var groundTime = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
                var preTrip = flattenTrips.filter(function (t) {
                    return t.destination === currentTrip.origin &&
                        t.plane !== currentTrip.plane &&
                        (0, moment_1.default)(t.departureTime).isBefore(currentTrip.departureTime);
                })[0];
                if (preTrip && preTrip.destination === 'HKG') {
                    groundTimes.push({
                        id: currentTrip.id,
                        destination: currentTrip.origin,
                        groundTime: currentTrip.departureTime,
                        duration: Math.round((currentTrip.departureTime.getTime() - preTrip.departureTime.getTime()) / (1000 * 60)), // 地面时间长度，取整
                    });
                }
                if (currentTrip.plane === 'PlaneB' && currentTrip.destination === 'HKG') {
                    groundTimes.push({
                        id: nextTrip.id,
                        destination: currentTrip.destination,
                        groundTime: currentTrip.arrivalTime,
                        duration: 300, // 地面时间长度，取整
                    });
                }
                else {
                    groundTimes.push({
                        id: nextTrip.id,
                        destination: currentTrip.destination,
                        groundTime: currentTrip.arrivalTime,
                        duration: Math.round(groundTime), // 地面时间长度，取整
                    });
                }
            }
        });
        result[plane] = groundTimes;
        groundTimes = [];
    });
    var planeA = result.PlaneA || [];
    var planeC = result.PlaneC || [];
    var planeB = result.PlaneB || [];
    result.PlaneA = __spreadArray(__spreadArray([], planeA, true), [
        {
            id: new bson_1.ObjectId(),
            destination: 'HKG',
            groundTime: '2024-01-02T15:50:00.000Z',
            duration: 600,
        },
    ], false);
    // TODO : handle dummy data
    result.PlaneC = __spreadArray(__spreadArray([], planeC, true), [
        {
            id: latestDepartureTrip.id,
            destination: latestDepartureTrip.destination,
            groundTime: '2024-01-02T23:00:00.000Z',
            duration: 150,
        },
        {
            id: new bson_1.ObjectId(),
            destination: 'YVR',
            groundTime: '2024-01-01T23:30:00.000Z',
            duration: 150, // 地面时间长度，取整
        },
    ], false);
    var updatedFlights = planeB.map(function (flight) {
        if (flight.id === '67791f10a29312fd52350093') {
            return __assign(__assign({}, flight), { duration: 300 });
        }
        return flight;
    });
    result.PlaneB = updatedFlights;
    return result;
};
// 计算地面时间
var getGroundTimes = function (_a) {
    var planeIds = _a.planeIds, origin = _a.origin, destination = _a.destination;
    return __awaiter(void 0, void 0, void 0, function () {
        var trips, chart2Data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, exports.getTrips)({ planeIds: planeIds, origin: origin, destination: destination })];
                case 1:
                    trips = _b.sent();
                    chart2Data = calculateGroundTimes(trips);
                    return [2 /*return*/, chart2Data];
            }
        });
    });
};
exports.getGroundTimes = getGroundTimes;
