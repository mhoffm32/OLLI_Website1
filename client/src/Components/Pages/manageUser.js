import React from 'react';
import ReactDOM from 'react-dom';

  
const manageUser = ({ changePage, user }) => {

    const menuItems = [
        { username: 'User 1' },
        { username: 'User 2' },
        { username: 'User 3' },
      ];

  return (

    <div className="userApproval">
    <h1>User Approval Menu</h1>

    <div class="approvalControls">
        <div class='userMenu'>
            <select id='pendingUsers'>
            {menuItems.map((item, index) => (
                            <option key={index} value={`user${index + 1}`}>{item.username}</option>
                        ))}
            </select>
        </div>

        <div class='statusButtons'>
            <button type="submit" id="approvalButton">Approve</button>
            <button type="submit" id="denyButton">Deny</button>
        </div>
    </div>
    </div>
  );
};

export default manageUser;