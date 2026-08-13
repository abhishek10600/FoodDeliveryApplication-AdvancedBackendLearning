import { ValidationError } from "../errors/ValidationError.js";
import { ValidationFormatter } from "./validation-error.js";
export const validate = (schema) => {
    return (req, res, next) => {
        if (schema.body) {
            const result = schema.body.safeParse(req.body);
            if (!result.success) {
                return next(new ValidationError(ValidationFormatter.format(result.error)));
            }
            req.body = result.data;
        }
        if (schema.params) {
            const result = schema.params.safeParse(req.params);
            if (!result.success) {
                return next(new ValidationError(ValidationFormatter.format(result.error)));
            }
            req.params = result.data;
        }
        if (schema.query) {
            const result = schema.query.safeParse(req.params);
            if (!result.success) {
                return next(new ValidationError(ValidationFormatter.format(result.error)));
            }
            req.query = result.data;
        }
        next();
    };
};
