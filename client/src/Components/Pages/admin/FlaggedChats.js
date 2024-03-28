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
      console.log("msicmwei", chat_id);

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
        console.log(res);
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
      <ul>
        {messages ? (
          <>
            {" "}
            {messages.map((msg, index) => (
              <li key={index}>
                <p>{`Sender: ${msg.sender}`}</p>
                <p>{`Reciever(s): ${msg.participants.join(", ")}`}</p>
                <p>{`Message: "${msg.text}" `}</p>
                <button onClick={() => deleteChat(msg._id)}>
                  Delete Message
                </button>
                <button onClick={() => disableUser(msg.sender_id)}>
                  Disable Sender Priviliges
                </button>
              </li>
            ))}
          </>
        ) : (
          <></>
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
