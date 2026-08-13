import { env } from "../../config/env.config.js";
import { helmetMiddleware } from "./helmet.js";
import { bodyParserMiddleware } from "./body-parser.js";
import { cookieParserMiddleware } from "./cookies.js";
import { corsMiddleware } from "./cors.js";
import { globalRateLimiter } from "./rate-limit.js";
import { timeoutMiddleware } from "./timeout.js";
export const registerSecurity = (app) => {
    app.set("trust proxy", env.TRUST_PROXY);
    app.use(helmetMiddleware);
    app.use(bodyParserMiddleware);
    app.use(cookieParserMiddleware);
    app.use(corsMiddleware);
    app.use(globalRateLimiter);
    app.use(timeoutMiddleware);
};
