import React, { Component } from 'react';
import GLogin from '../Pages/GLogin'
function speak() {  
  // Create a SpeechSynthesisUtterance object

  const text = window.getSelection().toString() || "No text highlighted."
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginText: '',
            isSidebarOpen: false
  
        };
    }
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    readHighlightedText = () => {
      const text = window.getSelection().toString();
      if(text){
          speak(text);
      }
      else{
        speak("No text is highlighted");
      }
    };

    cancelSpeech = () => {
      window.speechSynthesis.cancel();
    };

    toggleSidebar = () => {
      this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
    };


    handleSubmit = (event) => {
        this.state.loginText = ""
        document.querySelector('.loginText').textContent = ''
        event.preventDefault();
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.state.email)){
            alert("Please enter a valid email");
            return;
        } else if(this.state.email === undefined || this.state.email === ""){
            alert("Please enter an email");
            return;
        } else if(this.state.password === undefined || this.state.password === ""){
            alert("Please enter a password");
            return;
        } else {
            fetch(`/login/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({email: this.state.email, password: this.state.password}),
            })
            .then(res => res.json()
            .then(data => {
              if(res.status == 410){
                alert("Log In Unsuccesful. Account Not Verified")
                let resend = window.confirm("Would you like to resend the verification email?")
                console.log(resend)
                if(resend){
                  fetch(`/user/resendVerification/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: this.state.email})
                  })
                  .then(res => res.json()
                  .then(data => {
                      if(res.status !== 200){
                        console.log(res.status)
                      }
                      else {
                        console.log(data)           
                      }
                  }))
                }
              } else if(res.status == 400){
                console.log("Invalid Credentials. Please try another password or log in using google.")
                this.state.loginText = 'Please try another password or log in using google.'
                document.querySelector('.loginText').textContent = 'Please try another password or log in using google.'
              }
               else if(res.status == 409){
                
                alert("Log In Unsuccesful. Account Disabled. Contact Admin")
              } else if (res.status == 404){
                console.log("email does not exust")
              }else if(res.status !== 200){
                console.log(res.status)
                alert("Log In Unsuccesful")
              }
              else {
                this.props.changePage('Home')
                console.log(data) 
                localStorage.setItem('jwt', data.token);      
               
              }
            }))
        }
    }

    render() {
        const { email, password } = this.state;
        const {isSidebarOpen} = this.state;
        const dynamicStyle = {
          left: isSidebarOpen ? '60px' : '0px',
          transition: '0.5s', // Animated transition for the sidebar toggle button
        }
        

        return (
            <div>
              
               
                <button onClick={() => this.props.changePage('Home')} className='backBtn'><img src="/images/BackArrow.png" alt="Back" className='backArrowImg' /></button>
                
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
                <h1>Login Page</h1>
                <button className="sidebar-toggle" style={dynamicStyle} onClick={this.toggleSidebar}>{isSidebarOpen ? <img src="/images/icons/close.png"></img> : <img src="/images/icons/sidebaropen.png"></img>}</button>
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                  <div className='speech-button'>
                        <button id="speech-btn" onClick={this.readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img></button>

             </div>
             <div className="cancel-speech">
                <button id="cancel-btn" onClick={this.cancelSpeech}>
                <img id="pause" src='/images/icons/pause.png'></img></button>
                </div>
             </div>

                <div id="g-login-btn1"><GLogin changePage={this.props.changePage}/></div>
  
                <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={this.handleInputChange}
                            className='usernameBar'
                            placeholder="Email..."
                        />
                    <br />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                            className='passwordBar'
                            placeholder="Password..."
                        />
                    <br />
                    <button type="submit" className='loginBtn'>Login</button>
                    
                    <p className='loginText'>{this.state.loginText}</p>
                </form>
                <button id="forgotPassword" onClick={() => this.props.changePage('ForgotPassword')}>Forgot Password?</button>
            </div>
        );
        speak();
    }
}

export default Login;
