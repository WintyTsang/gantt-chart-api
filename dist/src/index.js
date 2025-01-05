"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
// import swaggerUi from 'swagger-ui-express';
var body_parser_1 = __importDefault(require("body-parser"));
var flights_1 = __importDefault(require("./routes/flights"));
// import HttpException from './models/http-exception.model';
// import swaggerDocument from '../docs/swagger.json';
var app = (0, express_1.default)();
/**
 * App Configuration
 */
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(flights_1.default);
// Serves images
app.use(express_1.default.static('public'));
app.get('/', function (req, res) {
    res.json({ status: 'API is running on /api' });
});
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs', function (req, res) {
    res.json({
        swagger: 'the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api',
    });
});
/* eslint-disable */
// app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
//   // @ts-ignore
//   if (err && err.name === 'UnauthorizedError') {
//     return res.status(401).json({
//       status: 'error',
//       message: 'missing authorization credentials',
//     });
//     // @ts-ignore
//   } else if (err && err.errorCode) {
//     // @ts-ignore
//     res.status(err.errorCode).json(err.message);
//   } else if (err) {
//     res.status(500).json(err.message);
//   }
// });
/**
 * Server activation
 */
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.info("server up on port " + PORT);
});
