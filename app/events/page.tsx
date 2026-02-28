import EventCard from "@/components/EventCard";
import { getAllEvents } from "@/lib/actions/event.action";

const EventsPage = async () => {
  const events = await getAllEvents();

  return (
    <section>
      <h1 className="text-center">All Upcoming Events</h1>
      <p className="text-center mt-5 mb-10">
        Browse and join the most exciting developer events.
      </p>

      <ul className="events">
        {events && events.length > 0 ? (
          events.map((event: any) => (
            <li key={event._id.toString()}>
              <EventCard {...event} />
            </li>
          ))
        ) : (
          <p className="text-center col-span-full">No events found.</p>
        )}
      </ul>
    </section>
  );
};

export default EventsPage;
