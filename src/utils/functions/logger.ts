import * as winston from "winston";
const { MongoDB } = require("winston-mongodb");
import{ MONGO } from "../../env";
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(), // Log to console
        new MongoDB({
            level: "info",
            db: MONGO, 
            options: {
                useUnifiedTopology: true 
            },
            collection: "logs", // Collection name in MongoDB
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});