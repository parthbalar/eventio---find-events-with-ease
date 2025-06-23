import EventCard from "../components/EventCard";

export default function EventsPage(loading) {

  return (
    <div className="mx-10 my-5">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
        All Upcoming Events
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : filteredEvents.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredEvents.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No matching upcoming events found.</p>
      )}
    </div>
  );
}
