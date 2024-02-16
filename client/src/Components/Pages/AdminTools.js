import { useEffect, useState } from "react";
import UploadLetter from "../Pages/UploadLetter";


const AdminTools = ({ changePage , user}) => {
    const [page, setPage] = useState("adminHome");

    const getCurrentPage = () => {
        let pages = {"uploadLetter" : <UploadLetter/>}
        return pages[page];
    }

  return (

    <div id="admin-options" className="admin-stuff">
    <h1>Admin Tools</h1>
    <div id="admin-page">
  
        {page === "adminHome" ? <>
        <div id="a-menu-btns">
        <button id='admin-menu-btn' className="admin-btn" onClick={()=>setPage("uploadLetter")}>
           Upload Newsletters
        </button>
        <button id='admin-menu-btn'className="admin-btn" onClick={()=>setPage("manageSchedule")}>
           Manage Schedule
        </button>
        </div>
        </> : <>
        
        <button onClick={()=> setPage("adminHome")} className='backBtn2'><img src="/images/BackArrow.png" alt="Back" className='backArrowImg2' /></button>
        {getCurrentPage()}
        </>}
    </div>
    </div>
  );
};

export default AdminTools;
