// logger file for logging purposes
const { createLogger, format, transports } = require('winston');
const winston = require('winston');
require('dotenv').config();

const { version } = require('../../package.json');

const levels = {
  error: 0,
  success: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
  silly: 7
};

const colors = {
  error: 'red',
  success: 'green',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray'
};

winston.addColors(colors);

const logger = createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { version: version, development: process.env.NODE_ENV === 'development' ? true : false },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/success.log', level: 'success' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize({ all: true }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const msg = stack || message;
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${msg}${metaStr}`;
      })
    )
  }));
}

module.exports = logger;