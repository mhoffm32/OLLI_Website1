import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import Home from "../Pages/Home";

const CLIENT_ID = "placeholder_ID";

const GLogin = ({ changePage }) => {
  const [user, setUser] = useState(null);

  const handleSuccess = (credentials) => {
    console.log("Login Success: ", credentials);

    // Send the authorization code to the backend
    const info = jwtDecode(credentials.credential);
    sendAuthorizationCode(credentials.credential);
  };

  const sendAuthorizationCode = async (code) => {
    try {
      const response = await fetch("/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
        }),
      });

      const u = await response.json();
      localStorage.setItem("jwt", u.token);
      const usr = u.token;
      setUser(usr);
      console.log(jwtDecode(usr));

      changePage("Home");
    } catch (error) {
      console.error("Error communicating with backend:", error.message);
    }
  };

  const handleFailure = () => {
    console.log("Login Failed");
    // You can handle the failed login here, e.g., show an error message.
  };

  const handleLogout = () => {
    googleLogout();
    console.log("logging out");
    setUser(null);
    //console.log("isSignedIn: ", isSignedIn, "User: ", user )
  };

  return (
    <div id="g-login-btn">
      <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={handleSuccess}
        onError={handleFailure}
        prompt="select_account"
      />
    </div>
  );
};

export default GLogin;
