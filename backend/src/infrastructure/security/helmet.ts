import { RequestHandler } from "express";
import helmet from "helmet";

export const helmetMiddleware: RequestHandler = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: {
    policy: "same-origin"
  },
  crossOriginResourcePolicy: {
    policy: "same-site"
  },
  dnsPrefetchControl: {
    allow: false
  },
  noSniff: true,
  frameguard: {
    action: "deny"
  },
  hidePoweredBy: true,
  // hsts: {
  //   maxAge: 31536000,
  //   includeSubDomains: true,
  //   preload: true
  // }
  xssFilter: true,
  permittedCrossDomainPolicies: false,
  ieNoOpen: true,
  originAgentCluster: true
});
