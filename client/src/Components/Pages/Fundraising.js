import React, { Component } from 'react';
function speak() {  

    const text = window.getSelection().toString() || "No text highlighted."
    const utterance = new SpeechSynthesisUtterance(text);
    
    window.speechSynthesis.speak(utterance);
  }
class Fundraising extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSidebarOpen: false
        };
        this.toggleSidebar = this.toggleSidebar.bind(this); 
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

    toggleSidebar() {
        this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
    }

    
    cancelSpeech = () => {  
        window.speechSynthesis.cancel();
    };


    render() {
        const { isSidebarOpen } = this.state;
        const dynamicStyle = {
            left: isSidebarOpen ? '60px' : '0px',
            transition: '0.5s',/* Animated transition for sidebar */

        }

        const style = {
            width: '300px',
            height: '150px'
        };
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
            <div className="fundraising">
                <h1>Fundraisers We Support</h1>
                <h3>Support O.L.L.I. by donating to our wonderful community programs!</h3>
                <br></br>
                <div className="container">
                    <a className="child bounce" target="_blank" href='https://sunsetcommunityfoundation.ca/'><img src='\images\Sunset-Community-Foundation-Logo-Colour-1024x453.png' style={style}></img></a>
                </div>
                <p>Grand Bend Sunset Foundation</p>
                <hr></hr>
                <br />
                <div className="container">
                    <a className="child bounce" target="_blank" href='https://www.canadahelps.org/en/charities/the-ontario-caregiver-organization/'><img src='/images/caregivers.png'></img></a>
                </div>
                <p>Ontario Caregiver Organization</p>
                <hr></hr>
                <br/>
                <div className="container">
                    <a className="child bounce" target="_blank" href='https://algarva168.org/'><img height="150px" src='/images/algarva.jpeg'></img></a>
                </div>
                <p>Order of Alhambra, Algarva 168</p>
                <hr></hr>
                <br/>
                <div className="container">
                    <a className="child bounce" target="_blank" href='https://www.rockglen.com/'><img height="150px" src='/images/rockglen.jpeg'></img></a>
                </div>
                <p>Rock Glen Resorts</p>
                <br></br>
            </div>
            </div>
        );
    }
}

export default Fundraising;
