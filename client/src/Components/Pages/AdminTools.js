import React, { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";
import ManageSchedule from "../Pages/ManageSchedule";

import ManageUser from "../Pages/ManageUser";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");

 
  const getCurrentPage = () => {
    let pages = {"uploadLetter" : <UploadLetter/>, "manageUser" : <manageUser/>, "manageSchedule" : <ManageSchedule/>}
    return pages[page];
}

  return (
   
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

  );
};

export default AdminTools;
