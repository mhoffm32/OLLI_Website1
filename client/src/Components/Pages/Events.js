import React, { Component } from 'react';
import SignatureCanvas from "react-signature-canvas";
import { jwtDecode } from 'jwt-decode';


function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    const text = window.getSelection().toString() || "No text highlighted."  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
          events: [],
          expandedEventId: null,
          showWaiverFields: false,
          isAdmin: false,
          isSidebarOpen: false
        };
        this.sigCanvas = React.createRef();
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.getEvents();
        const token = localStorage.getItem('jwt');
        if (token) {
            const decodedToken = jwtDecode(token);
            this.state.isAdmin = decodedToken.type === 'admin';
        }
      }

    getEvents = () => {
        fetch('/events/getAllEvents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(events => this.setState({ events }))
    }

    toggleSidebar() {
        this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
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

    cancelSpeech = () => {
        window.speechSynthesis.cancel();
    };

    clearSignature = () => {
        if (this.sigCanvas.current) {
            this.sigCanvas.current.clear(); // Clear the signature pad
        }
    }

    signUp = () => {
        if (this.sigCanvas.current) {
            const signature = this.sigCanvas.current.toDataURL(); // Get the data URL of the signature

            // Send the signature in a server request
            fetch('/events/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({ signature, eventId: this.state.expandedEventId }) // Send the signature as part of the request body
            })
                .then(res => res.json())
                .then(response => {
                    // Handle the response
                    console.log(response);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }
    }

    render() {
        const { isSidebarOpen } = this.state;
        const dynamicStyle = {
            left: isSidebarOpen ? '60px' : '0px',
            transition: '0.5s',
        };

        /* Visual looks*/
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
            <div className="events">
                <h1>Come Join our Events</h1>
                {this.state.isAdmin && <button onClick={() => this.props.changePage('EventCreator')}>Create Event</button>}
                {this.state.events.map((event, index) => (
                    <div className='eventBox'>
                        <h2>{event.title}</h2>
                        <p>{event.location}</p>
                        <p>{new Date(event.date).toLocaleString()}</p>
                        <button onClick={() => this.setState({ expandedEventId: this.state.expandedEventId === event._id ? null : event._id })}>
                            {this.state.expandedEventId === event._id ? 'Hide Details' : 'Show Details'}
                        </button>
                        {this.state.expandedEventId === event._id && (
                            <div>
                                <p>{event.description}</p>
                                {this.state.showWaiverFields ? (
                                    <div>
                                        {event.waiver.map((waiverSection, index) => (
                                            <div key={index} className='waiverSection'>
                                                <h3>{waiverSection.header}</h3>
                                                <p>{waiverSection.content}</p>
                                            </div>
                                        ))}
                                        <div className='signatureContainer'>
                                        <SignatureCanvas ref={this.sigCanvas} penColor="black" canvasProps={{ className: "sigCanvas" }}/>
                                        </div>
                                        <button onClick={this.clearSignature}>Clear Signature</button>
                                        <button onClick={() => this.signUp()}>Sign Up</button>
                                    </div>
                                ) : (
                                    <button onClick={() => this.setState({ showWaiverFields: true })}>Sign Up</button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            </div>
        );
    }
}

export default Events;
