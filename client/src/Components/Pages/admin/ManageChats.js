import { useEffect, useState } from "react";
import FlaggedChats from "./FlaggedChats";
import AdminChatView from "./AdminChatView";
import { jwtDecode } from "jwt-decode";

const ManageChats = ({ setPage }) => {
  const [chatPage, setChatPage] = useState("home");
  const [usernames, setUsernames] = useState([]);
  const [search, setSearch] = useState("");
  const [userView, setUserView] = useState(null);
  const [filteredUsernames, setFilteredUsernames] = useState([]);

  useEffect(() => {
    speak();
    setChatPage("home");
    getUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, usernames, chatPage]);

  useEffect(() => {}, [usernames, filteredUsernames]);

  const getCurrentPage = () => {
    let pages = {
      "flagged-chats": <FlaggedChats />,
      chatView: <AdminChatView user_id={userView} />,
    };
    if (chatPage == "home") {
      setPage("ManageChats");
    } else {
      return pages[chatPage];
    }
  };

  const setViewing = async (user) => {
    setUserView(user._id);
    setChatPage("chatView");
  };

  const filterUsers = () => {
    const filtered = usernames.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsernames(filtered);
  };

  const getUsers = async () => {
    const user_id = jwtDecode(localStorage.getItem("jwt")).id;
    try {
      const response = await fetch(`/api/chat/getUsernames/${user_id}`);
      const names = await response.json();

      if (response.ok) {
        setFilteredUsernames(names);
        setUsernames(names);
        console.log(names);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving thread info for user: " + error.message);
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
        setUsernames((prevUsernames) => {
          return prevUsernames.map((user) => {
            if (user._id === user_id) {
              return { ...user, chats_enabled: false };
            }
            return user;
          });
        });
        setFilteredUsernames((prevFilteredUsernames) => {
          return prevFilteredUsernames.map((user) => {
            if (user._id === user_id) {
              return { ...user, chats_enabled: false };
            }
            return user;
          });
        });
      } else {
        console.log("error occurred: ", response);
      }
    } catch (error) {
      console.log("Error disabling user: " + error.message);
    }
  };

  const enableUser = async (user_id) => {
    try {
      const response = await fetch(`/api/chat/enableUser`, {
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
        setUsernames((prevUsernames) => {
          return prevUsernames.map((user) => {
            if (user._id === user_id) {
              return { ...user, chats_enabled: true };
            }
            return user;
          });
        });
        setFilteredUsernames((prevFilteredUsernames) => {
          return prevFilteredUsernames.map((user) => {
            if (user._id === user_id) {
              return { ...user, chats_enabled: true };
            }
            return user;
          });
        });
      } else {
        console.log("error occurred: ", response);
      }
    } catch (error) {
      console.log("Error enabling user: " + error.message);
    }
  };

  return (
    <div className="manage-chats">
      {chatPage == "home" ? (
        <button id="return-btn" onClick={() => setPage("adminHome")}>
          Return
        </button>
      ) : (
        <button id="return-btn" onClick={() => setChatPage("home")}>
          Return
        </button>
      )}

      {chatPage == "home" ? (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              id="flagged-chats"
              onClick={() => setChatPage("flagged-chats")}
              style={{
                border: 0,
                fontWeight: "bolder",
                backgroundColor: "gray",
              }}
            >
              See Flagged Chats
            </button>
          </div>
          <h1>View Activity By User</h1>
          Username:{" "}
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          <ul id="chat-usr-list">
            {filteredUsernames.length !== 0 ? (
              <>
                {""}
                {filteredUsernames.map((user, index) => (
                  <li
                    className={
                      index == 0 && filteredUsernames.length == 1
                        ? "first-i"
                        : "later-i"
                    }
                    id="chat-usr-item"
                    key={index}
                  >
                    <p id="username-i">{user.username}</p>
                    <div id="left-buttons">
                      <button
                        id="left-chat-opt"
                        onClick={() => setViewing(user)}
                        style={{
                          border: 0,
                          fontWeight: "bolder",
                        }}
                      >
                        View Activity
                      </button>
                      {user.chats_enabled ? (
                        <button
                          style={{
                            backgroundColor: "#d96e66",
                            border: 0,
                            fontWeight: "bolder",
                          }}
                          id="left-chat-opt"
                          onClick={() => disableUser(user._id)}
                        >
                          Disable Sender Priviliges
                        </button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: "#6b9166",
                            border: 0,
                            fontWeight: "bolder",
                          }}
                          onClick={() => enableUser(user._id)}
                        >
                          Enable Sender Priviliges
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <>
                <br></br>
                <p>{"\nLoading Users..."}</p>
              </>
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
