import React, { Component } from 'react';
import GLogin from './GLogin';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    let text = "Here you can signup for an account with o living learning."
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: ''
        };
    }

    inputSanitization = (input) =>{
        if(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w-_]{0,20}$/.test(input)){
            console.log("Input is valid: " + input)
            return true;
        } else {
            return false;
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.state.email)){
            alert("Please enter a valid email");
            return;
        } else if(this.state.email === undefined || this.state.email === ""){
            alert("Please enter an email");
            return;
        } else if(this.state.username === undefined || this.state.username === ""){
            alert("Please enter a username");
            return;
        } else if(this.state.password === undefined || this.state.password === ""){
            alert("Please enter a password");
            return;
        } else if (!this.inputSanitization(this.state.username)){
            alert("Please enter a valid username");
            return;
        } else if (!this.inputSanitization(this.state.password)){
            alert("Please enter a valid password");
            return;
        } else {
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: this.state.email, username: this.state.username, password: this.state.password})
            })
            .then(res => res.json())
            .then(data => {
                if(data.message === "Email already exists"){
                    alert("Email already exists");
                } else if (data.message == 'Signup failed') {
                    alert("Failed Signing Up")
                } else {
                    console.log('Change page to ValidateEmail');
                    this.props.changePage('ValidateEmail');
                }
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        speak();
        const { username, password, email} = this.state;

        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'><img src="/images/BackArrow.png" alt="Back" className='backArrowImg' /></button>
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
                <div id="g-login-btn1"><GLogin changePage={this.props.changePage}/></div>
                <h1>Signup Page</h1>
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
                            type="text"
                            name="username"
                            value={username}
                            onChange={this.handleInputChange}
                            className='usernameBar'
                            placeholder="Username..."
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
                    <button type="submit" className='loginBtn'>Sign Up</button>
                </form>
            </div>
        );
    }
}

export default Signup;
