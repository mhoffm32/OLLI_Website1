import { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";


const AdminTools = ({ changePage , user}) => {
    const [page, setPage] = useState("adminHome");

    const getCurrentPage = () => {
        let pages = {"uploadLetter" : <UploadLetter/>}
        return pages[page];
    }

  return (

    <div id="admin-options">
    <h1>Admin Tools Home</h1>

    <div id="admin-page">
  
        {page === "adminHome" ? <>
        <button id='admin-menu-btn' onClick={()=>setPage("uploadLetter")}>
           Upload Newsletters
        </button>
        <br/>
        <button id='admin-menu-btn' onClick={()=>setPage("manageSchedule")}>
           Manage Schedule
        </button>
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
