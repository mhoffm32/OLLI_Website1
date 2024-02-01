import React, { Component } from 'react';

class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
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

        const {email, password, type } = this.state;


        try{
            const response = await fetch('/user/requestVerification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password, type})
            });
           

            const data = await response.json();
            const {status, message} = data;

            if(status === 'ok'){
                alert('Verification request sent successfully');
            }
            else if (message === 'User not found'){
                this.setState({error: 'User not found'});
            }
            else if (message === 'Invalid password'){
                this.setState({error: 'Invalid password'})
            }
            else{
                this.setState({error: 'Error encountered'})
            }
        }
        catch(error){
            this.setState({error: error.message});
           
        }
    }

    render() {
        const { username, password, type, error} = this.state;

        return (
            <div className="verification">
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
                    {error && <p className='error-message'>{error}</p>}

                </form>
            </div>
        );
    }
}

export default Verification;