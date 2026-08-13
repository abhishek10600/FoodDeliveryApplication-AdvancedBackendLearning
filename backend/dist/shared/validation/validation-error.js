export class ValidationFormatter {
    static format(error) {
        return error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message
        }));
    }
}
