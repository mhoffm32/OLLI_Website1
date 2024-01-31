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
    setUser(jwtDecode(credentials.credential))
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
      </button> : <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={handleSuccess}
        onError={handleFailure}
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
