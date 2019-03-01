'use strict';

// Inspired from https://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/

const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

// Get current execution environment: development or production
const env = process.env.NODE_ENV || 'development';

// Directory used for logs
const logDir = 'logs';
if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'rainbow-lex-sample.log');

const logger = caller => {
    return createLogger({
        level: env === 'production' ? 'info' : 'debug',
        format: format.combine(
            format.splat(),
            format.label({ label: path.basename(caller) }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({
                formar: format.combine(
                    format.colorize(),
                    format.printf(
                        info => 
                            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                    )
                )
            }),
            new transports.File({
                filename,
                format: format.combine(
                    format.printf(
                        info => 
                            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                    )
                )
            })
        ]
    });
}

module.exports = logger;