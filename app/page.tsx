import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

/**
 * NOTE (Vercel / Next 16 prerender):
 * During `next build`, Server Components may run while prerendering pages.
 * At that time, environment variables like NEXT_PUBLIC_BASE_URL might be unset,
 * so doing `fetch(`${BASE_URL}/api/...`)` can crash the build with `ERR_INVALID_URL`.
 *
 * To keep functionality the same (rendering the latest events), we read directly from
 * the database instead of calling our own API routes over HTTP.
 */
async function getEvents() {
  // Next.js Cache Components directive:
  // Cache this DB query and revalidate periodically so prerender is fast and stable.
  "use cache";
  cacheLife("hours");

  await connectDB();

  // `lean()` returns plain JSON-ish objects (better for RSC + serialization).
  return Event.find().sort({ createdAt: -1 }).lean();
}

const page = async () => {
  const events = await getEvents();

  return (
    <section>
      <h1 className="text-center ">
        The Hub for Every Dev <br /> Event You can’t Miss
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences , All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        {/* Event Cards will go here */}
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 &&
            events.map((event: any) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
