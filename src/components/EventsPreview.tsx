
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";
import { useNavigate } from "react-router-dom";

const EventsPreview = () => {
  const navigate = useNavigate();
  
  const events = [
    {
      id: 1,
      title: "Village Council Meeting",
      date: "24 June 2023",
      time: "10:00 AM",
      location: "Panchayat Bhavan, Ward 3",
      attendees: 45
    },
    {
      id: 2,
      title: "Health Camp & Vaccination Drive",
      date: "30 June 2023",
      time: "9:00 AM - 4:00 PM",
      location: "Primary Health Center",
      attendees: 120
    },
    {
      id: 3,
      title: "Agricultural Workshop",
      date: "5 July 2023",
      time: "11:00 AM",
      location: "Community Hall",
      attendees: 75
    }
  ];

  const handleViewAllEvents = () => {
    notify("Navigating to all events", "info");
    navigate("/events");
  };

  const handleEventDetails = (eventId, eventTitle) => {
    notify(`Viewing details for event: ${eventTitle}`, "info");
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Village Events</h2>
            <p className="text-gray-600 max-w-2xl">
              Stay informed about important community gatherings, government programs, and local festivals.
            </p>
          </div>
          <Button 
            className="mt-4 lg:mt-0 bg-rural-leaf hover:bg-rural-leaf/90 transition-all duration-300 transform hover:scale-105"
            onClick={handleViewAllEvents}
          >
            View All Events
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="rural-card hover:translate-y-[-5px] transition-all duration-300 hover:shadow-md">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <span className="text-sm font-medium text-rural-terracotta">Upcoming Event</span>
                <h3 className="text-xl font-semibold mt-1">{event.title}</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-rural-terracotta" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-rural-terracotta" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-rural-terracotta" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-rural-terracotta" />
                  <span>{event.attendees} Attendees</span>
                </div>
              </div>
              
              <button 
                className="w-full py-2 border border-rural-terracotta text-rural-terracotta rounded-md hover:bg-rural-terracotta/10 transition-colors"
                onClick={() => handleEventDetails(event.id, event.title)}
              >
                Event Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPreview;
