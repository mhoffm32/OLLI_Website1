import React, { useEffect, useState } from "react";
import UploadLetter from "./UploadLetter";
import ManageSchedule from "./ManageSchedule";
import ManageUser from "./manageUser";
import AddImages from "./addImages";
import DeleteReviews from "./DeleteReviews";
import ManageChats from "./ManageChats";

const AdminTools = ({ changePage, user }) => {
  const [page, setPage] = useState("adminHome");
  
 
  const getCurrentPage = () => {
    let pages = {"uploadLetter" : <UploadLetter/>, "manageUser" : <ManageUser/>, "manageSchedule" : <ManageSchedule/>, "AddImages" : <AddImages/>, "DeleteReviews" : <DeleteReviews/>, "ManageChats" : <ManageChats/>}  
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
        <button id='delete-rvw-btn' onClick={()=>setPage("DeleteReviews")}>
           Delete Reviews
        </button>
        <br/>
        <button id='admin-menu-btn' onClick={()=>setPage("manageUser")}>
           Manage Users
        </button>
        <button id='admin-menu-btn' onClick={()=>setPage("ManageChats")}>
           Manage Chats
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
