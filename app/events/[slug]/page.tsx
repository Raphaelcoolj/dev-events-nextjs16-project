

import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { getSimilarEventBySlug } from "@/lib/actions/event.action";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cacheLife } from "next/cache";

/**
 * Same idea as the homepage:
 * Avoid `fetch(`${BASE_URL}/api/...`)` during build/prerender because BASE_URL may be undefined.
 * We query MongoDB directly and use Cache Components so Next can prerender safely.
 */

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={11} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex grow gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

async function getEventBySlug(slug: string) {
  // Mark the DB read as cached so it can be used during prerender without triggering
  // “Uncached data was accessed outside of <Suspense>” errors.
  "use cache";
  cacheLife("hours");

  await connectDB();
  return Event.findOne({ slug }).lean();
}

async function getSimilarEvents(slug: string) {
  // This wraps the “similar events” query with a cache boundary too.
  // Internally it hits MongoDB.
  "use cache";
  cacheLife("hours");

  return getSimilarEventBySlug(slug);
}

const EventContent = async ({ slug }: { slug: string }) => {
  // EventContent does multiple async reads; marking it cached makes the intent explicit.
  "use cache";
  cacheLife("hours");

  const event = await getEventBySlug(slug);
  if (!event) return notFound();

  const {
    _id,
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event as any;

  if (!description) return notFound();

  const parsedTags = Array.isArray(tags) ? tags : [];
  const parsedAgenda = Array.isArray(agenda) ? agenda : [];

  // Keeping the existing behavior (static placeholder for now)
  const bookings = 10;

  const similarEvents: any[] = await getSimilarEvents(slug);

  return (
    <>
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/*left side - Event content*/}
        <div className="content">
          <Image
            src={image}
            alt="event banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="date icon" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="time icon" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location icon"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="mode icon" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience icon"
              label={audience}
            />
          </section>

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventAgenda agendaItems={parsedAgenda} />

          <EventTags tags={parsedTags} />
        </div>

        {/*right side - Booking Form*/}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot for this event!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot for this event!</p>
            )}

            {/* BookEvent is a client component; ensure eventId is a string */}
            <BookEvent eventId={String(_id)} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: any) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </>
  );
};

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  // Cache the route segment rendering too.
  "use cache";
  cacheLife("hours");

  const { slug } = await params;

  return (
    <section id="event">
      {/*
        Suspense remains in place (same UI behavior), but now all data reads are cached,
        which prevents Next 16 “blocking route” prerender errors.
      */}
      <Suspense fallback={<div>Loading event details...</div>}>
        <EventContent slug={slug} />
      </Suspense>
    </section>
  );
};

export default EventDetailsPage;
