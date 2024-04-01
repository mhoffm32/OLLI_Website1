import { useEffect, useState } from "react";

const FlaggedChats = () => {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    speak();
    getFlagged();
  }, []);

  const getFlagged = async () => {
    try {
      const response = await fetch(`/api/admin/chat/getFlagged`);
      const res = await response.json();

      if (response.ok) {
        setMessages(res.msgs);
        console.log(res.msgs);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving chat info for user: " + error.message);
    }
  };

  const deleteChat = async (chat_id) => {
    try {
      const response = await fetch(`/api/chat/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chat_id,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => {
          return prevMessages.filter((message) => {
            return message._id !== chat_id;
          });
        });
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving chat info for user: " + error.message);
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
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            if (message.sender_id === user_id) {
              return { ...message, sender_enabled: false };
            }
            return message;
          });
        });
        console.log(res);
      } else {
        console.log("error occured: ", response);
      }
    } catch (error) {
      console.log("Error retrieving chat info for user: " + error.message);
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
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            if (message.sender_id === user_id) {
              return { ...message, sender_enabled: true };
            }
            return message;
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
      <h1>Flagged Chats</h1>
      <ul>
        {messages ? (
          <>
            {" "}
            {messages.map((msg, index) => (
              <li
                className={index == 0 ? "first-i" : "later-i"}
                id="chat-usr-item"
                key={index}
              >
                <p>{`Sender: ${msg.sender}`}</p>
                <p>{`Reciever(s): ${msg.participants.join(", ")}`}</p>
                <p>{`Message: "${msg.text}" `}</p>
                <div id="left-buttons">
                  <div id="njwnxq">
                    <button
                      onClick={() => deleteChat(msg._id)}
                      style={{
                        marginRight: 0,
                        backgroundColor: "gray",
                        border: 0,
                        fontWeight: "bolder",
                      }}
                    >
                      Delete Message
                    </button>
                  </div>
                  {msg.sender_enabled ? (
                    <button
                      style={{
                        backgroundColor: "#d96e66",
                        border: 0,
                        fontWeight: "bolder",
                      }}
                      id="left-chat-opt"
                      onClick={() => disableUser(msg.sender_id)}
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
                      id="left-chat-opt"
                      onClick={() => enableUser(msg.sender_id)}
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
            <br></br>
            <p>Loading Chats...</p>
          </>
        )}
      </ul>
    </div>
  );
};

export default FlaggedChats;

function speak() {
  // Create a SpeechSynthesisUtterance object
  let text = "";
  const utterance = new SpeechSynthesisUtterance(text);
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
