import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
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
    const user = info.event.extendedProps.user; // Changed to extendedProps
    const title = info.event.title;
    const start = info.event.start;
    const end = info.event.end;
    const note = info.event.extendedProps.note; // Changed to extendedProps
    
    // Convert start time to UTC time and format
    const startTime = start.toLocaleString( { hour: 'numeric', minute: '2-digit' });
    let alertMessage = "User: " + user + "\nEvent: " + title + "\nFrom: " + startTime;
    
    // Check if end time is available
    if (end) {
      // Convert end time to UTC time and format
      const endTime = end.toLocaleString( {  hour: 'numeric', minute: '2-digit' });
      alertMessage += "\nTo: " + endTime;
    } else {
      alertMessage += " (No end time)";
    }

    if (note) {
      alertMessage += "\nNote: " + note;
    }
    
    alert(alertMessage);
  };
 
  return (
    <div id="fullcalendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        id="calendar-id"
        initialView="dayGridMonth"
        events={bookedDates.map((date) => ({
          user: date.username,
          title: date.event,
          start: date.pickup.toLocaleString([], {hour: 'numeric', minute: '2-digit'}),
          end: date.dropoff.toLocaleString([], {hour: 'numeric', minute: '2-digit'}),  
          note: date.note
        }))}
        eventDisplay="list-item"
        eventClick={eventClicked}
      />
    </div>
  );
};

export default ManageSchedule;
