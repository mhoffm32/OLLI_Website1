import React, { Component } from 'react';
import GLogin from '../Pages/GLogin'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginText: ''
        };
    }
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        this.state.loginText = ""
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
            fetch(`http://localhost:3002/api/login/`, {
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
                  fetch(`http://localhost:3002/api/user/resendVerification/`, {
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
                this.state.loginText = 'Please try another password or log in using google.'
              }
               else if(res.status == 409){
                
                alert("Log In Unsuccesful. Account Disabled. Contact Admin")
              } else if(res.status !== 200){
                console.log(res.status)
                alert("Log In Unsuccesful")
              }
              else {
                console.log(data) 
                localStorage.setItem('jwt', data.token);        
              }
            }))
        }
    }

    render() {
        const { email, password } = this.state;

        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
                <h1>Login Page</h1>

                <div id="g-login-btn1"><GLogin/></div>
  
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
            </div>
        );
    }
}

export default Login;
