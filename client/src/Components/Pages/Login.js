import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // Add your login logic here
    }

    render() {
        const { username, password } = this.state;

        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <img src="/images/OLLILOGO.png" alt="OLLI Logo" className='logo' />
                <h1>Login Page</h1>
                <form onSubmit={this.handleSubmit}>
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
                    <button type="submit" className='loginBtn'>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;
