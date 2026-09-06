import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "../config.js";
export const security = [
  helmet({ contentSecurityPolicy: false }),
  cors({ origin: config.frontendOrigin, credentials: true }),
  rateLimit({
    windowMs: 60_000,
    limit: 80,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
];
