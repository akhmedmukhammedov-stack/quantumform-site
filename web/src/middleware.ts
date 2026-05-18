import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip i18n redirects for: API routes, Payload admin, Next internals, static files.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
