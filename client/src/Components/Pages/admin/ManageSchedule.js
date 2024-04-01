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
    
    // Convert start time to UTC time and format
    const startTime = start.toLocaleString( { hour: 'numeric', minute: '2-digit' });
    let alertMessage = "Event: " + title + " From: " + startTime;
    
    // Check if end time is available
    if (end) {
      // Convert end time to UTC time and format
      const endTime = end.toLocaleString( {  hour: 'numeric', minute: '2-digit' });
      alertMessage += " To: " + endTime;
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
          start: date.pickup.toLocaleString([], {hour: 'numeric', minute: '2-digit'}),
          end: date.dropoff.toLocaleString([], {hour: 'numeric', minute: '2-digit'})  
        }))}
        eventDisplay="list-item"
        eventClick={eventClicked}
      />
    </div>
  );
};

export default ManageSchedule;