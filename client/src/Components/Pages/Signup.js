import React, { Component } from 'react';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: ''
        };
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
        } else {
            fetch('http://localhost:3002/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: this.state.email, username: this.state.username, password: this.state.password})
            })
            .then(res => res.json())
            .then(data => {
                if(data === "User already exists"){
                    alert("User already exists");
                } else {
                    this.props.changePage('Login');
                }
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        const { username, password, email} = this.state;

        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
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
