import { jwtDecode } from 'jwt-decode';
import { useState, useEffect} from 'react';
const UserSettings = () => {
    const [userSettings, setSettings] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [selectedPfp, setSelectedPfp] = useState('');

    const user = jwtDecode(localStorage.getItem('jwt'));

    useEffect(()=>{
        getCurrentSettings()
    },[])

    const getCurrentSettings = async () => {
        try{
            const id =  jwtDecode(localStorage.getItem('jwt')).id
            const response = await fetch(`http://localhost:3002/api/user/settings/${id}`);
        
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
            const response = await fetch(`http://localhost:3002/api/user/updateSettings`, {
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
            const response = await fetch('http://localhost:3002/user/changeName', {
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
    };
    
    const updatePfp = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch('http://localhost:3002/user/updatePfp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ pfp: selectedPfp }),
            });
    
            if (response.ok) {
                alert('Profile picture updated successfully');
                // Optionally, refresh the user settings here
            } else {
                alert('Failed to update profile picture');
            }
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            alert("Failed to update profile picture due to an error.");
        }
    };
    
    return (
        <div id="account-settings"><br/><br/><br/>
            <h1>Account Settings</h1> 

            {userSettings !== null ? <>
                <div id="email-prefs">
                    <p>
                        Monthly Email Newsletter
                    </p>

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
                    <p>
                        Change Name
                    </p>
                    <input type="text" name="first_name" value={firstName || ''} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"/>
                    <input type="text" name="last_name" value={lastName || ''} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"/>
                    <button onClick={updateName}>Save</button>
                </div>
                <div id="pfp-pref">
                    <p>Choose Profile Picture</p>
                    <div>
                        <button id="pfp" className={selectedPfp === 'blue' ? 'selected' : ''} onClick={() => setSelectedPfp('blue')}><img src="/images/icons/pfp1.png"/></button>
                        <button id="pfp" className={selectedPfp === 'green' ? 'selected' : ''} onClick={() => setSelectedPfp('green')}><img src="/images/icons/pfp2.png"/></button>
                    </div>
                    <button onClick={updatePfp}>Save</button>
                </div>
            </> : <></>}
        </div>
    );
}
export default UserSettings;