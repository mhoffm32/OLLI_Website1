import { jwtDecode } from 'jwt-decode';
import { useState, useEffect} from 'react';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    const text = window.getSelection().toString() || "No text highlighted."
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
const UserSettings = () => {
    const [userSettings, setSettings] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        email: '', 
    });
    const [selectedPfp, setSelectedPfp] = useState('');

    const token = localStorage.getItem('jwt');

    useEffect(()=>{
        getCurrentSettings();
        getUserDetails();
    },[]);

    const readHighlightedText = () => {
        const text = window.getSelection().toString();
        if (text) {
          speak(text);
        } else {
          speak("No text is highlighted");
        }
      };
      
      const cancelSpeech = () => {
        window.speechSynthesis.cancel();
      };

    const getUserDetails = async () => {
        try {
            const response = await fetch(`/user/details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserDetails({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    pfp: data.pfp,
                });
            } else {
                console.error('Failed to fetch user details:', response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const getCurrentSettings = async () => {
        try{
            const id =  jwtDecode(localStorage.getItem('jwt')).id
            const response = await fetch(`/api/user/settings/${id}`);
        
            if (response.ok) {
                let data = await response.json()

                setSettings(data.settings)

              } else {
                  console.error('Failed to fetch newsletters:', response.statusText);
              }
    
          }catch(error){
            console.error("error",error)
          }
    }

    const updateSettings = async () => {
        try{
            const response = await fetch(`/api/user/updateSettings`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({settings: userSettings})
              });
        
            if (response.ok) {
                let data = await response.json()
                setSettings(data.settings)
              } else {
                  console.error('Failed to fetch newsletters:', response.statusText);
              }
    
          }catch(error){
            console.error("error",error)
          }
          
          getCurrentSettings();
    }


    const updateEmailPref = (value) => {
        let setting = false; 
        if(value === true || value === "true"){
            setting = true;
        }

        setSettings((prevStates) => ({
            ...prevStates,
            email_newsletter: setting
        }));

        console.log(userSettings)
    };

    const updateName = async () => {
        const token = localStorage.getItem('jwt'); // Retrieve the JWT token from localStorage
        try {
            const response = await fetch('/user/changeName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use the JWT token for authentication
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                }),
            });
    
            if (response.ok) {
                let data = await response.json();
                alert(data.message); // Show success message to the user
                // Optionally, update the UI or user settings state here
            } else {
                let errorData = await response.json();
                alert(errorData.message); // Show error message to the user
            }
        } catch (error) {
            console.error("Failed to update name:", error);
            alert("Failed to update name due to an error.");
        }
        getUserDetails();
    };
    
    const updatePfp = async () => {
        console.log(selectedPfp);
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch('/user/updatePfp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ pfp: selectedPfp }),
            });
    
            if (response.ok) {
                alert('Profile picture updated successfully');

            } else {
                const errorText = await response.text();
                alert(`Failed to update profile picture: ${errorText}`);
            }
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            alert("Failed to update profile picture due to an error.");
        }
        getUserDetails();
    };    

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const dynamicStyle = {
        left: isSidebarOpen ? "60px" : "0px",
        transition: "0.5s",
    };
    
    return (
        <div>
            <button
                className="sidebar-toggle"
                style={dynamicStyle}
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? (
                    <img src="/images/icons/close.png"></img>
                ) : (
                    <img src="/images/icons/sidebaropen.png"></img>
                )}
            </button>
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className='speech-button'>
                    <button id="speech-btn" onClick={readHighlightedText}>
                        <img id="speaker" src='/images/icons/speech.png'></img>
                    </button>
                </div>
                <div className="cancel-speech">
                    <button id="cancel-btn" onClick={cancelSpeech}>
                        <img id="pause" src='/images/icons/pause.png'></img>
                    </button>
                </div>
            </div>

        <div id="account-settings">
            <h1>Account Settings</h1> 

            {userSettings !== null ? <>
                <div id="user-details">
                    <h3>Current Profile Details</h3>
                    <hr></hr>
                    <img src={userDetails.pfp} className="pfp"></img>
                    <p>Email: {userDetails.email}</p>
                    <p>First Name: {userDetails.firstname}</p>
                    <p>Last Name: {userDetails.lastname}</p>
                </div>
                <div id="email-prefs">
                    <h3>
                        Monthly Email Newsletter
                    </h3>

                    <label class="switch">
                    <input 
                    type="checkbox" 
                    onChange={(e) => updateEmailPref(e.target.checked)} 
                    checked={userSettings && userSettings.email_newsletter}
                    />
                        <span class="slider round"></span></label>
                        <button onClick={()=>updateSettings()}>Save</button>
                </div>
                <div id="name-pref">
                    <h3>
                        Change Name
                    </h3>
                    <input type="text" name="first_name" value={firstName || ''} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"/>
                    <input type="text" name="last_name" value={lastName || ''} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"/>
                    <button onClick={updateName}>Save</button>
                </div>
                <div id="pfp-pref">
                    <h3>Choose Profile Picture</h3>
                    <div>
                        <button id="pfp" className={selectedPfp === 'racoon' ? 'selected' : ''} onClick={() => setSelectedPfp('/images/icons/racoon.png')}><img src="/images/icons/racoon.png"/></button>
                        <button id="pfp" className={selectedPfp === 'lion' ? 'selected' : ''} onClick={() => setSelectedPfp('/images/icons/lion.png')}><img src="/images/icons/lion.png"/></button>
                        <button id="pfp" className={selectedPfp === 'platypus' ? 'selected' : ''} onClick={() => setSelectedPfp('/images/icons/platypus.png')}><img src="/images/icons/platypus.png"/></button>
                        <button id="pfp" className={selectedPfp === 'bear' ? 'selected' : ''} onClick={() => setSelectedPfp('/images/icons/bear.png')}><img src="/images/icons/bear.png"/></button>
                    </div>
                    <button onClick={updatePfp}>Save</button>
                </div>
                <br></br>
            </> : <></>}
        </div>
        </div>
    );
}
export default UserSettings;