import express from "express";
const jsonMiddleware = express.json({
    limit: "100kb",
    strict: true
});
const urlEncodedMiddleware = express.urlencoded({
    extended: true,
    limit: "100kb",
    parameterLimit: 100
});
export const bodyParserMiddleware = [
    jsonMiddleware,
    urlEncodedMiddleware
];
