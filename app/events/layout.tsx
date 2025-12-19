import { Suspense } from "react";

/**
 * Next.js 16 (Cache Components) can throw:
 *   "Uncached data was accessed outside of <Suspense>" 
 * during prerender if anything in this route segment performs async I/O that is treated as
 * request-time (or if Next cannot prove it is cached).
 *
 * By placing a parent <Suspense> boundary at the segment level (`/events/*`), we ensure
 * that even if a page/component under this segment needs to read uncached data, the route
 * can show a fallback instead of blocking the entire HTML response.
 *
 * This keeps functionality unchanged while making builds and prerendering stable.
 */
export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading events...</div>}>{children}</Suspense>;
}
