import React, { Component } from 'react';

class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            type: '',
            error: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value, error: ''});
    }

    handleVerificationTypeChange = (event) =>{
        this.setState({type: event.target.value, error: ''});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.state.email)){
            this.setState({error: 'Please enter a valid email'});
            return;
        }
        else if(this.state.email === undefined || this.state.email === ""){
            this.setState({error: 'Please enter an email'});
            return;
        }
        else if(this.state.password === undefined || this.state.password === ""){
            this.setState({error: 'Please enter a password'});
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3002/api/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    type: this.state.type
                })
            });
            
            
    
            const data = await response.json();
            const { status, message } = data;
    
            if (status === 'ok') {
                alert('Verification request sent successfully');
            } else if(message === 'Invalid entries for email/password') {
                this.setState({error: 'Invalid format for entries'})
            }
            else if (message === 'User not found') {
                this.setState({ error: 'User not found' });
            } else if (message === 'Invalid password') {
                this.setState({ error: 'Invalid password' });
            } else {
                this.setState({ error: 'Error encountered' });
            }
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
    
    render() {
        const { email, password, type, error} = this.state;

        return (
            <div className="verification">
                <h1>Request Account Verification</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={this.handleInputChange}
                            className='emailBar'
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
                    <button type="submit" disabled={!(type && email && password)}>Submit Request</button>
                    {error && <p className='error-message'>{error}</p>}

                </form>
            </div>
        );
    }
}

export default Verification;