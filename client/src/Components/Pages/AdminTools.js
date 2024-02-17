import React, { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";
import ManageSchedule from "../Pages/ManageSchedule";

import ManageUser from "../Pages/manageUser";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");

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
    const getCurrentPage = () => {
        let pages = {"uploadLetter" : <UploadLetter/>, "manageUser" : <ManageUser/>, "manageSchedule" : <ManageSchedule/>}
        return pages[page];
    }
  };
  }


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
            <button id="admin-sched-btn" onClick={() => setPage("manageSchedule")}>
              Manage Schedule
            </button>
          </>
        ) : (
          <>
            <button id="return-btn" onClick={() => setPage("adminHome")}>
              Return
            </button>
            {page === "uploadLetter" && <UploadLetter />}
            {page === "manageSchedule" && <ManageSchedule />} 
          </>
        )}
      </div>
    <div id="admin-page">
  
        {page === "adminHome" ? <>
        <button id='admin-menu-btn' onClick={()=>setPage("uploadLetter")}>
           Upload Newsletters
        </button>
        <br/>
        <button id='admin-menu-btn' onClick={()=>setPage("manageSchedule")}>
           Manage Schedule
        </button>
        <br/>
        <button id='admin-menu-btn' onClick={()=>setPage("manageUser")}>
           Manage Users
        </button>
        </> : <>
        <button id='return-btn' onClick={()=> setPage("adminHome")}>
            Return
        </button>
        {getCurrentPage()}
        </>}
    </div>
    </div>
  );
};

export default AdminTools;
