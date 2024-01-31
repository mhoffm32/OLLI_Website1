import React, { Component } from 'react';

class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            type: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleVerificationTypeChange = (event) =>{
        this.setState({type: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        const { username, password, type} = this.state;

        return (
            <div>
                <h1>Request Account Verification</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={this.handleInputChange}
                            className='usernameBar'
                        />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                            className='passwordBar'
                        />
                    </label>
                    <br />
                    <label>
                        Verification Type:
                        <select
                            value={type}
                            onChange={this.handleVerificationTypeChange}
                        >
                            <option value="">Select Type</option>
                            <option value="caregiver">Become Verified Caregiver</option>
                            <option value="member">Become Verified CHEER member</option>

                        </select>
                    </label>
                    <button type="submit" disabled={!(type && username && password)}>Submit Request</button>
                </form>
            </div>
        );
    }
}

export default Verification;