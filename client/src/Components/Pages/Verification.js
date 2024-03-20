import React, { Component } from 'react';
function speak() {  
  
    const text = window.getSelection().toString() || "No text highlighted."   
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
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

    readHighlightedText = () => {
        const text = window.getSelection().toString();
        if(text){
            speak(text);
        }
        else{
            window.speechSynthesis.cancel();
            speak("No text is highlighted");
        }
    };

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

            const response = await fetch('/api/request', {
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
            const { message } = data;
    
            if (response.ok) {
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
            <div>
                  <div className='speech-button'>
                        <button id="speech-btn" onClick={this.readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img>Click to hear highlighted text out loud</button>


             </div>
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
            </div>
        );
    }
}

export default Verification;