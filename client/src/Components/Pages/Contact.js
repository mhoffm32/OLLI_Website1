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
                    <h4>Send an Email to Ivey Hartman:</h4>
                </div>


                <div class="messageOptions">
                    <input type='text' id='contactName' placeholder='Enter name here'></input>
                    <input type='text' id='contactEmail' placeholder='Enter email here'></input>
                    <input type='text' id='contactMessage' placeholder='Enter message here'></input>
                </div>

                </div>

                <div class = "contacts2">

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

                <div class="locationInfo">

                    <h2>Location hours: </h2>
                    <h3>Cheer Connections center:</h3>
                    <h5>Weekdays: 9am-7pm</h5>
                    <h5>Saturdays: 9am-9pm</h5>
                    <h5>Sundays: 11am-6pm</h5>


                    <h3>Roxy mini-golf and CHEER canteen:</h3>
                    <h5>Weekdays: 9am-7pm</h5>
                    <h5>Saturdays: 9am-9pm</h5>
                    <h5>Sundays: 11am-6pm</h5>


                </div>


                </div>
                </div>
            </div>
        );
    }
}

export default Contact;
