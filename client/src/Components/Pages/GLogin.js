import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';

const CLIENT_ID =
  "227573894857-410pmafu7279nappmuv7gfkuf2t32bt0.apps.googleusercontent.com";
  
const GLogin = () => {
  const [user, setUser] = useState(null);
  
  const handleSuccess = (credentials) => {
    console.log('Login Success: ', credentials);

    // Send the authorization code to the backend
    const info = jwtDecode(credentials.credential)
    sendAuthorizationCode(credentials.credential);
   
  };

  const sendAuthorizationCode = async (code) => {
    try {
      const response = await fetch('http://localhost:3002/api/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
        }),
      });

      const u = await response.json();
      localStorage.setItem('jwt', u.token); 
      const usr = u.token
      console.log(jwtDecode(usr)) 

    } catch (error) {
      console.error('Error communicating with backend:', error.message);
    }
};
  

  const handleFailure = () => {
    console.log('Login Failed');
    // You can handle the failed login here, e.g., show an error message.
  };
  const handleLogout = () => {
    googleLogout();
    console.log("logging out")
    setUser(null)
    //console.log("isSignedIn: ", isSignedIn, "User: ", user ) 
  }

  return (
    <div id="g-login-btn">
      {user ? <button id='signout-button' style={{ display: 'block'}} onClick={()=> handleLogout()} >
      <img className="logo" src="/images/google-logo.png" alt="Logo" />
      Sign Out
      </button > : <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={handleSuccess}
        onError={handleFailure}
        prompt="select_account"
      />}
    </div>
  );
};

export default GLogin;





/*
const clientId =
  "227573894857-410pmafu7279nappmuv7gfkuf2t32bt0.apps.googleusercontent.com";

const GLogin = () => {
  const [loggedin, setLog] = useState(false);

  function handleCallbackResponse(res){
    console.log("encoded JWT ID token: ", res.credential)
    var userObject = jwtDecode(res.credential)
    console.log("Current User: ", userObject)
    document.getElementById("signInDiv").hidden = true;
    setLog(true)
  }  

  function handleSignOut(){
    setLog(false)
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    //global google
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: 'outline'}
    )
    google.accounts.id.prompt();

  },[])

  return (
    <div id="signInButton">
      
      <button id='signout-button' style={{ display: loggedin ? 'block' : 'none'}} onClick={(e)=> handleSignOut(e)} >
      <img className="logo" src="/images/google-logo.png" alt="Logo" />
      Sign Out
      </button>
      <div id="signInDiv"></div> : 
    </div>
  );
};

export default GLogin;
*/
