import React from 'react';
function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    let text = "Please Validate email"
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
class ValidateEmail extends React.Component {
    render() {
        speak();
        return (
            <div>
                <button onClick={() => this.props.changePage('Home')} className='backBtn'>🡠</button>
                <h1>Validate Email</h1>
                <p>Please check your email and click on the validation link.</p>
                <button onClick={() => this.props.changePage('Login')} className='loginBtn'>Go to Login</button>
            </div>
        );
    }
}

export default ValidateEmail;
