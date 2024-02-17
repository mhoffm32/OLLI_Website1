import React, { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";
import ManageSchedule from "../Pages/ManageSchedule";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");


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
    </div>
  );
};

export default AdminTools;
