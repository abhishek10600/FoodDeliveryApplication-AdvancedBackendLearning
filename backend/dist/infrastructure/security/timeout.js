import timeout from "connect-timeout";
import { env } from "../../config/env.config.js";
export const timeoutMiddleware = timeout(env.REQUEST_TIMEOUT);
export const haltOnTimeout = (req, res, next) => {
    if (!req.timedout) {
        next();
    }
};
