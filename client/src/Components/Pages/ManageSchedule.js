import React, { useEffect, useState } from "react";
import FullCalendar  from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const ManageSchedule = ({ changePage, user }) => {
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const response = await fetch(`/getRegistrations`);
      if (!response.ok) {
        console.log("Error fetching data");
        return;
      }
      const data = await response.json();
      setBookedDates(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const eventClicked = (info) => {
    const title = info.event.title;
    const start = info.event.start;
    const end = info.event.end;
  
    let alertMessage = "Event: " + title + " From: " + start;
  
    // Check if end time is available
    if (end) {
      alertMessage += " To: " + end;
    } else {
      alertMessage += " (No end time)";
    }
  
    alert(alertMessage);
  };
 
  return (
    <div id="fullcalendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={bookedDates.map((date) => ({
          title: date.event,
          start: date.pickup,
          end: date.dropoff,
        }))}
        timeZone="UTC"
        eventDisplay="list-item"
        eventClick={eventClicked}
      />
    </div>
  );
};

export default ManageSchedule;
