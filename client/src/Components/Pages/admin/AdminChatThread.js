import React, { useEffect, useState, useRef } from "react";

const AdminChatThread = ({ thread_info, user }) => {
  const [thread, setThread_info] = useState(thread_info);
  const [curr_user, setUser] = useState(user);
  const [myMessage, setMyMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setMessages(thread.texts.sort((a, b) => b.time - a.time));
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    scrollBottom();
  }, [myMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages(thread._id);
    }, 8000); //every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const refreshMessages = async (thread_id) => {
    try {
      const response = await fetch(
        `/api/chat/getThread/${thread_id}/${curr_user.id}`
      );
      const info = await response.json();

      if (response.ok) {
        let nThread = info.thread_info;
        nThread.participants = thread.participants;
        setThread_info(nThread);
        setMessages(nThread.texts.sort((a, b) => b.time - a.time));
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving thread info for user: " + error.message);
    }
  };

  const getTitle = () => {
    let title = "";
    for (let p of thread.participant_ids) {
      title += thread.participants[p].username + ", ";
    }
    title = title.slice(0, -2);

    return <h1 id="gc-title">Admin View: {title}</h1>;
  };

  const getMessages = () => {
    return (
      <ul id="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <li
            key={index}
            id={
              message.sender_id == curr_user.id ? "send-li-item" : "rcv-li-item"
            }
          >
            <p
              className="author"
              id={
                message.sender_id == curr_user.id ? "send-author" : "rcv-author"
              }
            >
              {message.sender_id === curr_user.id
                ? curr_user.username
                : thread.participants[message.sender_id]?.username || "Unknown"}
            </p>
            <p className="msg-item">{message.text}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div id="thread-page">
      {getTitle()}
      <div id="centered-margin">
        <div id="chat-bg">{getMessages()}</div>
      </div>
    </div>
  );
};

export default AdminChatThread;
