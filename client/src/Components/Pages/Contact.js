import React, { Component, useState } from 'react';
import axios from 'axios'
function speak() {  
    // Create a SpeechSynthesisUtterance object
    const text = window.getSelection().toString() || "No text highlighted";
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }



class Contact extends Component {
        // DO NOT USE IVEYS EMAIL
        // const emailAddress = "ihartmancheer@gmail.com";
        
        constructor(props) {
            super(props);
            this.state = {
                name: '',
                email: '',
                message: '',
                subject: '',
                phoneNumber: '',
                isSidebarOpen: false
            };
            this.toggleSidebar = this.toggleSidebar.bind(this); 
        }

        handleChange = (e) => {
            console.log("Handling Change.. ");
            console.log("Event: ", e.target)
            this.setState({ [e.target.name]: e.target.value });
        };

        readHighlightedText = () =>{
            const text = window.getSelection().toString();
            if(text){
                speak(text);
            }
            else{
                speak("No text highlighted")
            }
        };

        toggleSidebar(){
            this.setState({isSidebarOpen: !this.state.isSidebarOpen});
        }

        cancelSpeech = () =>{
            window.speechSynthesis.cancel();
        }
        
        sendMessage = async (e) => {
            e.preventDefault();
            const { name, email, message, subject, phoneNumber } = this.state;
            try {
                const response = await axios.post('http://localhost:3000/user/send-ivey-message', { name, email, message, subject, phoneNumber });
                console.log(response);
                if (response.status === 200) {
                    alert("Email sent Successfully");
                } else {
                    // Handle any other success responses that don't result in an email being sent
                    alert('Unexpected response from server');
                }
            } catch (error) {
                console.error('Error sending message:', error);
        
                // Check if the error response has the expected structure and content
                if (error.response && error.response.data) {
                    const errorMessage = error.response.data.message;
                    if (errorMessage === 'Poor language detected! Please do not use profanity.') {
                        alert(errorMessage);
                    } else {
                        // Handle other potential error messages the same way
                        alert('Failed to send email');
                    }
                } else {
                    // Fallback error message if the response structure is not as expected
                    alert('Error sending message');
                }
            }
        };
        


    render() {
        const { isSidebarOpen } = this.state;
        const dynamicStyle = {
            left: isSidebarOpen ? '60px' : '0px',
            transition: '0.5s',/* Animated transition for sidebar */
        }
        return (
            <div>
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

            <div className="contact">
                <div>
                    <h1 id= "contactTitle">Let's Get in Touch</h1>
                    <div class ="contactMenu">
                        <div class = "contact-left">
                            <div class="repEmail">
                                <h3 id="instructions">Send an Email to Ivey Hartman:</h3>
                            </div>

                            <form onSubmit={this.sendMessage}>
                            <div class="messageOptions1">
                                <input type='text' id='contactName' name='name' value={this.state.name} onChange={(e) => this.handleChange(e)} placeholder='Enter name here'></input>
                                <input type='text' id='contactEmail' name='email' value={this.state.email} onChange={this.handleChange} placeholder='Enter email here'></input>
                            </div>

                            <div class="messageOptions2">
                                <input type='text' id='subject' name='subject' value={this.state.subject} onChange={this.handleChange} placeholder='Enter message subject here'></input>
                                <input type='text' id='contactPhone' name='phoneNumber' value={this.state.phoneNumber} onChange={this.handleChange} placeholder='Enter Phone Number here'></input>
                            </div>

                            <div class="messageOptions3">
                                <input type='text' id='contactMessage' name='message' value={this.state.message} onChange={this.handleChange} placeholder='Enter message here'></input>
                            </div>

                            <div class="submit button">
                                <button type='submit' id='sendButton'>Send Email</button>
                            </div>
                            </form>
                            
                        </div>

                        <div class = "contact-right">
                            <div class="locationInfo">
                                <h3>Hours and Location: </h3>
                            <div class="hours">
                                <img src={`/images/clock.png`} alt='logo'id="clock"/>
                                <h4>Roxy mini-golf and CHEER canteen hours:</h4>
                            </div>
                                <p>Weekdays: 5pm-10pm </p>
                                <p>Saturdays: 12pm-10pm</p>
                                <p>Sundays: 12pm-10pm</p>
                            <hr></hr>
                            
                            <div class="mapsLine">
                                <a href = "https://www.google.com/maps/place/8685+Rock+Glen+Rd,+Arkona,+ON+N0M+1B0/@43.08409,-81.8234248,17z/data=!3m1!4b1!4m20!1m13!4m12!1m4!2m2!1d-81.3069307!2d43.0087877!4e1!1m6!1m2!1s0x882f13a841b4229b:0x66f06e35c9ded4ab!2s8685+Rock+Glen+Road,+Arkona,+ON!2m2!1d-81.8208499!2d43.08409!3m5!1s0x882f13a841b4229b:0x66f06e35c9ded4ab!8m2!3d43.08409!4d-81.8208499!16s%2Fg%2F11c5knylhc?entry=ttu">
                                    <img src={`/images/mapsIcon.png`} alt='logo'id="maps"/>
                                </a>
                                <h4>Roxy mini-golf and CHEER canteen Address:</h4>
                            </div>
                                <p>8685 Rock Glen Rd, Arkona, ON, Canada, Ontario </p>
                                <p>(519) 828-3456</p>
                            </div>
                            <hr></hr>

                            <div class="fbLinks">
                                <div className="link">
                                <a href = "https://www.facebook.com/cheer.2023?mibextid=ZbWKwL">
                                <img src={`/images/facebook.png`} alt='logo'id="logoFB1"/>
                                </a>
                                <p>Cheer Facebook Page</p>
                                </div>

                                <div className="link">
                                <a href ="https://www.facebook.com/familyconnectionscheer?mibextid=ZbWKwL">
                                <img src={`/images/facebook.png`} alt='logo'id="logoFB2"/>
                                </a>
                                <p>Cheer Connections Facebook Page</p>
                                </div>

                                <div className="link">
                                <a href ="https://www.facebook.com/profile.php?id=100057044577232&mibextid=ZbWKwL">
                                <img src={`/images/facebook.png`} alt='logo'id="logoFB3"/>
                                </a>
                                <p>Roxy Mini-golf Facebook Page</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default Contact;
