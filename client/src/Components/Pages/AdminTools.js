import React, { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";
import ManageSchedule from "../Pages/ManageSchedule";
import ManageUser from "../Pages/manageUser";
import AddImages from "../Pages/addImages";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");

 
  const getCurrentPage = () => {
    let pages = {"uploadLetter" : <UploadLetter/>, "manageUser" : <ManageUser/>, "manageSchedule" : <ManageSchedule/>, "AddImages" : <AddImages/>}  
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
        <button id='add-images-btn' onClick={()=>setPage("AddImages")}>
            Upload Images
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
