import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";

function speak(text) {
  // Create a SpeechSynthesisUtterance object

  const utterance = new SpeechSynthesisUtterance(text);

  // Speak the text
  window.speechSynthesis.speak(utterance);
}

const ManageUser = ({ changePage }) => {
  // Define a function to fetch unverified users from the backend
  async function fetchUnverifiedUsers() {
    try {
      const response = await fetch("/user/unverifiedUsers");
      if (!response.ok) {
        throw new Error("Failed to fetch unverified users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      throw error;
    }
  }

  async function fetchNonStaffUsers() {
    try {
      const response = await fetch("/user/nonStaffUsers");
      if (!response.ok) {
        throw new Error("Failed to fetch non-staff users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching non-staff users:", error);
      throw error;
    }
  }

  const [pendingUsers, setPendingUsers] = useState([]); // State to store pending users
  const [nonStaffUsers, setNonStaffUsers] = useState([]); // State to store staff users

  // Fetch unverified users on component mount
  useEffect(() => {
    let text =
      "Here you can manage User verification status or make a general user into a staff member.";
    //speak(text);
    const fetchUsers = async () => {
      try {
        const users = await fetchUnverifiedUsers(); // Fetch unverified users
        setPendingUsers(users); // Set pending users state
      } catch (error) {
        console.error("Error fetching unverified users:", error);
      }
    };
    fetchUsers();

    const fetchNonStaff = async () => {
      try {
        const users = await fetchNonStaffUsers(); // Fetch unverified users
        setNonStaffUsers(users); // Set non staff users state
      } catch (error) {
        console.error("Error fetching non-staff users:", error);
      }
    };
    fetchNonStaff();
  }, []); // Empty dependency array to fetch users only once on mount

  // Event handler for approving or denying a user
  const handleStatusChange = (username, approveStatus, denyStatus) => {
    updateUserStatus(username, approveStatus, denyStatus);
  };

  const handleTypeChange = (username) => {
    updateUserType(username);
  };

  // Define a function to approve or deny a user
  async function updateUserStatus(username, approveStatus, denyStatus) {
    try {
      const response = await fetch("/user/approveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          approveStatus: approveStatus,
          denyStatus: denyStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const data = await response.json();
      console.log(data.message); // Log the response message
      let text = username + " has been updated";
      speak(text);

      const utterance = new SpeechSynthesisUtterance(text);

      // Speak the text
      window.speechSynthesis.speak(utterance);
      const users = await fetchUnverifiedUsers(); // Fetch unverified users
      setPendingUsers(users); // Set pending users state
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    }
  }

  // Define a function to approve or deny a user
  async function updateUserType(username) {
    try {
      const response = await fetch("/user/makeUserStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user type");
      }

      const data = await response.json();
      console.log(data.message); // Log the response message
      let text = username + " has been updated";
      speak(text);

      const utterance = new SpeechSynthesisUtterance(text);

      // Speak the text
      window.speechSynthesis.speak(utterance);
      const users = await fetchNonStaffUsers(); // Fetch unverified users
      setNonStaffUsers(users); // Set pending users state
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    }
  }

  fetchUnverifiedUsers();
  fetchNonStaffUsers();

  return (
    <div className="userApproval">
      <h1>User Approval Menu</h1>

      <div class="approvalControls">
        <div class="userMenu">
          <select id="pendingUsers">
            {pendingUsers.map((user, index) => (
              <option key={index} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div class="statusButtons">
          <button
            type="submit"
            id="approvalButton"
            onClick={() => {
              const username = document.getElementById("pendingUsers").value;
              handleStatusChange(username, true, false);
            }}
          >
            Approve
          </button>

          <button
            type="submit"
            id="denyButton"
            onClick={() => {
              const username = document.getElementById("pendingUsers").value;
              handleStatusChange(username, false, true);
            }}
          >
            Deny
          </button>
        </div>
      </div>

      <h1>Assign a User as a Staff Member</h1>

      <div class="approvalControls">
        <div class="userMenu">
          <select id="nonStaffUsers">
            {nonStaffUsers.map((user, index) => (
              <option key={index} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div class="statusButtons">
          <button
            type="submit"
            id="approvalButton"
            onClick={() => {
              const username = document.getElementById("nonStaffUsers").value;
              handleTypeChange(username, true, false);
            }}
          >
            Make Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
