import * as winston from "winston";
import * as expressWinston from "express-winston";

winston.configure({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
        winston.format.cli()
      ),
    }),
  ],
});

export const logger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.cli(),
  colorize: false,
});
