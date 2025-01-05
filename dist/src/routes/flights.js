"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var flightsController_1 = require("../controllers/flightsController");
var router = (0, express_1.Router)();
router.get('/', function (_, res) { res.send('Welcome!'); });
router.get('/trips', flightsController_1.getTripsHandler);
router.get('/ground-times', flightsController_1.getGroundTimesHandler);
exports.default = router;
// TODO: add error handling middleware
