import express, { RequestHandler } from "express"

const jsonMiddleware = express.json({
  limit: "100kb",
  strict: true
})

const urlEncodedMiddleware = express.urlencoded({
  extended: true,
  limit: "100kb",
  parameterLimit: 100
})

export const bodyParserMiddleware: RequestHandler[] = [
  jsonMiddleware,
  urlEncodedMiddleware
]
