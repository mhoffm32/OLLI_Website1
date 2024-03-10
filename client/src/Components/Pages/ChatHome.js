import React, { useEffect, useState } from "react";
import ChatThread from '../Pages/ChatThread'
import { jwtDecode } from "jwt-decode";

const ChatHome = ({ changePage }) => {
  const [page, setPage] = useState("chatHome");
  const [user, setUser] = useState();
  const [chatInfo,setChatInfo] = useState({});
  const [curr_thread_info, setCurrThreadInfo] = useState();
  const [usernames, setUsernames] = useState();
  const [filtered_usernames, setFilteredUsernames] = useState();
  const [newChatMembers, setChatMembers] = useState([]);
  const [new_member, setNewMember] = useState();
  const [addText, setAddText] = useState();
  const [message, setMessage] = useState();
  

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('jwt')))
    getChatsInfo();
    getUsernames();
  },[]);

  const getCurrentPage = () => {
    let pages = {"chatThread" : <ChatThread thread_info = {curr_thread_info} user={user} />}
    return pages[page];
  }

  const getChatsInfo = async () => {
    const user_id = jwtDecode(localStorage.getItem('jwt')).id;

    try {
      console.log(jwtDecode(localStorage.getItem('jwt')))
      const response = await fetch(`/api/chat/getChatInfo/${user_id}`);
      const res = await response.json();

      if (response.ok){
        setChatInfo(res.chat_info);
        console.log(res.chat_info.threads)
      } else {
        console.log("error occured: ", response)
      }
    } catch (error) {
      console.log('Error retrieving chat info for user: '+ error.message);
    }

  }

  const getThreadInfo = async (thread_id, index) => {
    try {
      
      const response = await fetch(`/api/chat/getThread/${thread_id}/${jwtDecode(localStorage.getItem('jwt')).id}`);
      const info = await response.json(); 

      if (response.ok){
        let thread = info.thread_info;
        thread.participants = chatInfo.threads[index].participants;
        setCurrThreadInfo(thread);

        let newInfo = chatInfo;
        newInfo.threads[index].unread = 0;
        setChatInfo(newInfo);   
      } else {
        console.log("error occured: ", response)
      }
    } catch (error) {
      console.log('Error retrieving thread info for user: '+ error.message);
    }
  }

  const getParticipants = (_id) => {

    let t = chatInfo.threads;
    t = t.find(element => element._id == _id);
  
    let participants = t.participants;
    let usernames = '';

    const numUsers = Object.keys(participants).length;
    let i=0;
    let limit = 5;
    for(let p in participants) {
      if(p !== user.id){
        if(i == limit) {
          break;
        }
        usernames += participants[p].username + ", ";
        i++;
      }
    }
    usernames = usernames.slice(0, -2);

    if(numUsers > limit){
      let others = numUsers - limit;
      participants += ` and ${others} others.`
    }
    return (usernames);
};

const getUsernames = async () => {
  const user_id = jwtDecode(localStorage.getItem('jwt')).id;

  try {
    const response = await fetch(`/api/chat/getUsernames/${user_id}`);
    const names = await response.json();
  
    if (response.ok){
      setFilteredUsernames(names)
      setUsernames(names)
      
    } else {
      console.log("error occured: ", response)
    }
  } catch (error) {
    console.log('Error retrieving thread info for user: '+ error.message);
  }
}

const handleInputChange = (event) => {
  const inputText = event.target.value.toLowerCase();
  const filtered = usernames.filter(user => user.username.toLowerCase().startsWith(inputText));
  setFilteredUsernames(filtered);
};


const memberList = () => {

  let memberjsx = newChatMembers.map((user,index) => (
    <div id="added-member" key={index}>
      <p>{user.username}</p>
      <button id="delete-member-btn" onClick={() => deleteChatMember(user)}><p>X</p></button>
    </div>
  ));
  return(<div id="new-chat-members">{memberjsx}</div>)

}

const deleteChatMember = (member) => {
  let newMembers = newChatMembers.filter(e  => e._id !== member._id);
  setChatMembers(newMembers);
}

const createThread = async() => {

  let recipient_ids = newChatMembers.map(member => member._id);
  recipient_ids.push(user.id);
  
    let curr_thread = chatInfo.threads.find(thread => {
      const thread_ids = Object.keys(thread.participants);
      return (
          thread_ids.length === recipient_ids.length &&
          new Set(thread_ids).size === new Set(recipient_ids).size &&
          thread_ids.every(id => new Set(recipient_ids).has(id))
      );
  });

  if(curr_thread){
    try {
      setChatMembers([]);
      setMessage('');
      setAddText('Message Sent.');
      document.getElementById("message-box1").value = ""

      const response = await fetch(`/api/chat/send-message`, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              thread_id: curr_thread._id, 
              message: message,
              sender_id: user.id
          })            
      });
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.log('Error sending message: '+ error.message);
    }

  } else if(newChatMembers.length) {
    try {
      const response = await fetch(`/api/chat/create-thread`, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({  
              message: message,
              sender_id: user.id,
              participants: recipient_ids
          })            
      });
  
      const result = await response.json();
      let newInfo = chatInfo;
      newInfo.threads.unshift(result);
      setChatInfo(newInfo);
      setChatMembers([]);
      setMessage('');
      setAddText('Message Sent.');
      document.getElementById("message-box1").value = "";
    } catch (error) {
      console.log('Error sending message: '+ error.message);
    }

  } else {
    setAddText("Please add message recipient(s).")
  }

}

const addToChat = () => {
  let userToAdd = usernames.find(obj => obj.username.toLowerCase() === new_member.trim().toLowerCase());

  if (!newChatMembers.includes(userToAdd)) {
    if (userToAdd) {
      let updatedMembers = [...newChatMembers, userToAdd];
      setChatMembers(updatedMembers); 
      document.getElementById('username-input').value = "";
    } else {
      setAddText("Invalid username.");
      document.getElementById('username-input').value = "";
    }
  }
}

const viewThread = async(thread,index) => {
  await getThreadInfo(thread._id, index);
  setPage("chatThread");
};


return (
  <div id="admin-page">
    {page === "chatHome" ? (
      <>
        {chatInfo ? (
          <>
          {chatInfo.chats_enabled == false ?
          <><br></br>
          <h2>Chats Unavailable.</h2></> : 
          <><h1 id='chat-header'>New Chat</h1>
            <div>
              <datalist id="suggestions">
                {usernames ? (
                  <>
                    {filtered_usernames.map((user, index) => (
                      <option key={index} value={user.username} id={user._id}></option>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </datalist>
              <div className="cont-outter-fx-cn">
                <div>
                  <p className="msg-label">To:</p><input autoComplete="on" id="username-input" onSelect={(e) => setNewMember(e.target.value)} list="suggestions" onChange={handleInputChange}/>
                  <button onClick={addToChat}>Add</button> {memberList()}
                </div>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
                  <p style={{margin:0}} className="msg-label" id="msg-box-label">Message: </p><textarea type="text" id='message-box1' style={{ width: '300px', height: '100px' }} onChange={(e)=> setMessage(e.target.value)}/>
                </div>
                <div>
                  <button onClick={createThread}>Send</button> 
                </div>
              </div>
            </div>
            <h1 id='chat-header'>Active Chats</h1>
            <div id="active-chat-list">
            <ol>
              {chatInfo.threads && chatInfo.threads.map((thread, index) => (
                <li id="chat-list-item" key={index}>
                  <div id="chat-item-div">
                  {thread.unread !== 0 ? <>
                  <div id="new-msg-bubble"><p id='unread-count'>{thread.unread}</p></div>
                  </> : <></>}
                  <p id="chat-name"> {getParticipants(thread._id)}</p>
                  <button id="view-chat-btn" onClick={()=> viewThread(thread,index)}>View</button>
                  </div>
                </li>
              ))}
            </ol>
            </div>
          </> }
        </>) : (
          <><br></br><br></br>
          <div>Loading Chats...</div></>
        )}
      </>
    ) : (
      <div>
      <button id='return-btn' onClick={() => setPage("chatHome")}>
        Return
      </button>
      {getCurrentPage()}
      </div>
    )}
  </div>
);

};

export default ChatHome;
