import React, { Component } from 'react';

class Contact extends Component {
    render() {
        const emailAddress = "ihartmancheer@gmail.com";
        return (
            <div>
                <h1 id= "contactTitle">Contact Page</h1>

            <div class ="contactsMenu">
                <div class = "contacts1">

                <div class="repEmail">
                <img src={`/images/placeholder.jpg`} alt='logo'id="placeholderCon"/>
                    <h4 id="instructions">Send an Email to Ivey Hartman:</h4>
                </div>

                <div class="messageOptions1">
                    <input type='text' id='contactName' placeholder='Enter name here'></input>
                    <input type='text' id='contactEmail' placeholder='Enter email here'></input>
                </div>

                <div class="messageOptions2">
                    <input type='text' id='subject' placeholder='Enter message subject here'></input>
                    <input type='text' id='contactPhone' placeholder='Enter Phone Number here'></input>
                </div>

                <div class="messageOptions3">
                    <input type='text' id='contactMessage' placeholder='Enter message here'></input>
                

                </div>

                <div class="submit button">
                    <button type='button' id='sendButton'>Send Email</button>
                </div>

                </div>
                <div class = "contacts2">

                

                <div class="locationInfo">

                    <h3>Location Information: </h3>
                <div class="hoursHeader">
                    <img src={`/images/clock.png`} alt='logo'id="clock"/>
                    <h4>Roxy mini-golf and CHEER canteen hours:</h4>
                </div>
                    <p>Weekdays: 5pm-10pm </p>
                    <p>Saturdays: 12pm-10pm</p>
                    <p>Sundays: 12pm-10pm</p>

                <div class="mapsLine">
                    <a href = "https://www.google.com/maps/place/8685+Rock+Glen+Rd,+Arkona,+ON+N0M+1B0/@43.08409,-81.8234248,17z/data=!3m1!4b1!4m20!1m13!4m12!1m4!2m2!1d-81.3069307!2d43.0087877!4e1!1m6!1m2!1s0x882f13a841b4229b:0x66f06e35c9ded4ab!2s8685+Rock+Glen+Road,+Arkona,+ON!2m2!1d-81.8208499!2d43.08409!3m5!1s0x882f13a841b4229b:0x66f06e35c9ded4ab!8m2!3d43.08409!4d-81.8208499!16s%2Fg%2F11c5knylhc?entry=ttu">
                        <img src={`/images/mapsIcon.png`} alt='logo'id="maps"/>
                    </a>
                    <h4>Roxy mini-golf and CHEER canteen Address:</h4>
                </div>
                    <p>8685 Rock Glen Rd, Arkona, ON, Canada, Ontario </p>
                    <p>(519) 828-3456</p>

                </div>

                <div class="fbLinks">
                <div class="fbLink">
                    <a href = "https://www.facebook.com/cheer.2023?mibextid=ZbWKwL">
                    <img src={`/images/facebookLogo.jpg`} alt='logo'id="logoFB1"/>
                    </a>
                </div>
                
                <div class = "connectionsLink">
                    <a href ="https://www.facebook.com/familyconnectionscheer?mibextid=ZbWKwL">
                    <img src={`/images/redFB.png`} alt='logo'id="logoFB2"/>
                    </a>
                </div>


                <div class = "worksLink">
                    <a href ="https://www.facebook.com/profile.php?id=100057044577232&mibextid=ZbWKwL">
                    <img src={`/images/greenFB.png`} alt='logo'id="logoFB3"/>
                    </a>
                </div>
                </div>


                </div>
                </div>
            </div>
        );
    }
}

export default Contact;
