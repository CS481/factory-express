import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import Router from "./Router.js";

// Imports for side effects
import CreateAccount from "./routes/CreateAccount.js";
import VerifyCredentials from "./routes/VerifyCredentials.js";
import SimulationInitialization from "./routes/SimulationInitialization.js";
import SimulationModification from "./routes/SimulationModification.js";
import BeginSim from "./routes/BeginSim.js";
import GetState from "./routes/GetState.js";
import SubmitResponse from "./routes/SubmitResponse.js";
import DataDump from "./routes/DataDump.js";
import GiveRole from "./routes/GiveRole.js";
import GetAllSims from "./routes/GetAllSims.js";


var app = express();
app.use(cors()); // Enable all CORS requests

// view engine setup
app.set('views', './views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

Router.applyRoutes(app);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
