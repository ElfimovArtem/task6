import winston from 'winston';

export const logger = winston.createLogger({
  transports: new winston.transports.Console({
    format: winston.format.json({
      space: 2
    })
  }),
  format: winston.format.combine(
    winston.format.colorize()
  )
})