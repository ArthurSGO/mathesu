import { createLogger, format, transports } from 'winston';
export const logger = createLogger({ level:'info', format:format.combine(format.timestamp(), format.simple()), transports:[ new transports.File({filename:'backend/logs/app.log'}), new transports.Console()] });
export const withRequestId=(req,_res,next)=>{ req.requestId = Math.random().toString(16).slice(2,10); next(); };
export const requestLogger=(req,_res,next)=>{ logger.info(`${req.method} ${req.originalUrl}`); next(); };
