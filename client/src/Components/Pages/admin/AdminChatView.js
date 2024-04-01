import React, { useEffect, useState } from "react";
import AdminChatThread from "./AdminChatThread";
import { jwtDecode } from "jwt-decode";

const AdminChatView = ({ user_id }) => {
  const [page, setPage] = useState("chatHome");
  const [user, setUser] = useState();
  const [chatInfo, setChatInfo] = useState({});
  const [curr_thread_info, setCurrThreadInfo] = useState();

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem("jwt")));
    getUserDetails(user_id);
    getChatsInfo();
  }, []);

  const getUserDetails = async (user_id) => {
    console.log("user id", user_id);
    const response = await fetch(`/api/admin/chat/getUser/${user_id}`);
    const res = await response.json();
    setUser(res);
  };

  const getCurrentPage = () => {
    let pages = {
      chatThread: (
        <AdminChatThread thread_info={curr_thread_info} user={user} />
      ),
    };
    return pages[page];
  };

  const getChatsInfo = async () => {
    //const user_id = jwtDecode(localStorage.getItem("jwt")).id;

    try {
      const response = await fetch(`/api/chat/getChatInfo/${user_id}`);
      const res = await response.json();

      if (response.ok) {
        setChatInfo(res.chat_info);
        console.log(res.chat_info.threads);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving chat info for user: " + error.message);
    }
  };

  const getThreadInfo = async (thread_id, index) => {
    try {
      const response = await fetch(
        `/api/chat/getThread/${thread_id}/${user_id}`
      );

      const info = await response.json();
      if (response.ok) {
        let thread = info.thread_info;
        thread.participants = chatInfo.threads[index].participants;
        setCurrThreadInfo(thread);
        let newInfo = chatInfo;
        newInfo.threads[index].unread = 0;
        setChatInfo(newInfo);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving thread info for user: " + error.message);
    }
  };

  const getParticipants = (_id) => {
    let t = chatInfo.threads;
    t = t.find((element) => element._id == _id);

    let participants = t.participants;
    let usernames = "";

    const numUsers = Object.keys(participants).length;
    let i = 0;
    let limit = 5;
    for (let p in participants) {
      if (p !== user.id) {
        if (i == limit) {
          break;
        }
        usernames += participants[p].username + ", ";
        i++;
      }
    }
    usernames = usernames.slice(0, -2);

    if (numUsers > limit) {
      let others = numUsers - limit;
      participants += ` and ${others} others.`;
    }
    return usernames;
  };

  const viewThread = async (thread, index) => {
    await getThreadInfo(thread._id, index);
    setPage("chatThread");
  };

  return (
    <div id="admin-page">
      {page === "chatHome" ? (
        <>
          {chatInfo ? (
            <>
              <>
                <div id="active-chat-div">
                  {user ? (
                    <>
                      <h1 id="chat-header">{user.username}'s Active Chats</h1>
                    </>
                  ) : (
                    <></>
                  )}

                  <div id="active-chat-list" style={{ marginBottom: "10px" }}>
                    <ol style={{ listStyleType: "none", padding: 0 }}>
                      {chatInfo.threads &&
                        chatInfo.threads.map((thread, index) => (
                          <li
                            key={index}
                            style={{
                              borderTop: "1px solid #6e6b6a",
                              padding: "10px 0",
                            }}
                          >
                            <div
                              id="chat-item-div"
                              style={{
                                margin: "0",
                                marginLeft: "25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "30px",
                                    marginRight: "25px",
                                  }}
                                >
                                  {thread.unread !== 0 && (
                                    <div id="new-msg-bubble">
                                      <p id="unread-count">{thread.unread}</p>
                                    </div>
                                  )}
                                </div>
                                <p
                                  id="chat-name"
                                  style={{ margin: 0, fontWeight: "bolder" }}
                                >
                                  {getParticipants(thread._id)}
                                </p>
                              </div>
                              <div>
                                <button
                                  id="view-chat-btn"
                                  style={{ marginRight: "50px" }}
                                  onClick={() => viewThread(thread, index)}
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ol>
                  </div>
                </div>
              </>
            </>
          ) : (
            <>
              <br></br>
              <br></br>
              <div>Loading Chats...</div>
            </>
          )}
        </>
      ) : (
        <div>
          <button id="return-btn" onClick={() => setPage("chatHome")}>
            Return
          </button>
          {getCurrentPage()}
        </div>
      )}
    </div>
  );
};

export default AdminChatView;
