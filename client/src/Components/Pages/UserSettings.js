import { jwtDecode } from 'jwt-decode';
import { useState, useEffect} from 'react';
const UserSettings = () => {
    const [userSettings, setSettings] = useState(null);

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
    

    return (<div id="account-settings">
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
    checked={userSettings && userSettings.email_newsletter}/>
        <span class="slider round"></span></label>
        <button onClick={()=>updateSettings()}>Save</button>
    </div>
    </> : <></>}
    </div>);
}
export default UserSettings;