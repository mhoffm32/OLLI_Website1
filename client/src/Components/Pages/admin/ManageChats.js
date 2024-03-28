import { useEffect, useState } from "react";
import FlaggedChats from "./FlaggedChats";
import AdminChatView from "./AdminChatView";
import { jwtDecode } from "jwt-decode";

const ManageChats = () => {
  const [page, setPage] = useState("home");
  const [usernames, setUsernames] = useState();
  const [search, setSearch] = useState();
  const [userView, setUserView] = useState();
  const [filtered_usernames, setFilteredUsernames] = useState();

  useEffect(() => {
    speak();
    setPage("home");
    getUsers();
  }, []);

  const getCurrentPage = () => {
    console.log("usrView", userView);
    let pages = {
      "flagged-chats": <FlaggedChats />,
      chatView: <AdminChatView user_id={userView} />,
    };
    return pages[page];
  };

  const setViewing = async (user) => {
    setUserView(user._id);
    setPage("chatView");
  };

  const getUsers = async () => {
    const user_id = jwtDecode(localStorage.getItem("jwt")).id;
    try {
      const response = await fetch(`/api/chat/getUsernames/${user_id}`);
      const names = await response.json();

      if (response.ok) {
        setFilteredUsernames(names);
        setUsernames(names);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving thread info for user: " + error.message);
    }
  };

  const filterUsers = async () => {
    let filtered_users = [];
    for (let user of usernames) {
    }
  };

  const disableUser = async (user_id) => {
    try {
      const response = await fetch(`/api/chat/disableUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        console.log(res);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving chat info for user: " + error.message);
    }
  };

  return (
    <div className="manage-chats">
      {page == "home" ? (
        <>
          <button id="flagged-chats" onClick={() => setPage("flagged-chats")}>
            See Flagged
          </button>
          <h1>View Activity By User</h1>
          Username:{" "}
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          <ul>
            {filtered_usernames ? (
              <>
                {" "}
                {filtered_usernames.map((user, index) => (
                  <li key={index}>
                    <p>{user.username}</p>
                    <button onClick={() => setViewing(user)}>
                      View Activity
                    </button>
                    <button onClick={() => disableUser(user.id)}>
                      Disable Sender Priviliges
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
        </>
      ) : (
        <> {getCurrentPage()} </>
      )}
    </div>
  );
};

export default ManageChats;

function speak() {
  // Create a SpeechSynthesisUtterance object
  let text = "";
  const utterance = new SpeechSynthesisUtterance(text);
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
