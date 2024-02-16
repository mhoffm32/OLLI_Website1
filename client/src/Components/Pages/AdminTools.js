import React, { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");
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
      console.log(bookedDates.map(date => ({
        title: date.event,
        start: date.pickup,
        end: date.dropoff
      })));
      
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
  
  const getCurrentPage = () => {
    let pages = { uploadLetter: <UploadLetter /> };
    return pages[page];
  };

  return (
    <div id="admin-options">
      <h1 id= "admin-title">Admin Tools Home</h1>
      <div id="admin-page">
        {page === "adminHome" ? (
          <>
            <button id="admin-menu-btn" onClick={() => setPage("uploadLetter")}>
              Upload Newsletters
            </button>
            <br />
            <button id="admin-menu-btn" onClick={() => setPage("manageSchedule")}>
              Manage Schedule
            </button>
          </>
        ) : (
          <>
            <button id="return-btn" onClick={() => setPage("adminHome")}>
              Return
            </button>
            <div id = "fullcalendar">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={bookedDates.map((date) => ({
                  title: date.event,
                  start: date.pickup,
                  end: date.dropoff,
                  
                }))}
                timeZone="UTC"
                eventClick={eventClicked}
            
              />

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTools;
