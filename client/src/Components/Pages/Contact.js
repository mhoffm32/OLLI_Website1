import React, { Component } from 'react';

class Contact extends Component {
    render() {
        const emailAddress = "ihartmancheer@gmail.com";
        const facebook ="https://www.facebook.com/cheer.2023?mibextid=ZbWKwL"
        const conectionFB ="https://www.facebook.com/familyconnectionscheer?mibextid=ZbWKwL"
        const worksFB ="https://www.facebook.com/profile.php?id=100057044577232&mibextid=ZbWKwL"
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
                    <input type='text' id='contactName'></input>
                    <input type='text' id='contactEmail'></input>
                    <input type='text' id='contactMessage'></input>
                </div>

                </div>

                <div class = "contacts2">
                <div class="fbLink">
                    <a href = "https://www.facebook.com/cheer.2023?mibextid=ZbWKwL">
                    <img src={`/images/facebookLogo.jpg`} alt='logo'id="logoFB"/>
                    </a>
                </div>
                
                <div class = "connectionsLink">
                    <a href ="https://www.facebook.com/familyconnectionscheer?mibextid=ZbWKwL">
                    <img src={`/images/facebookLogo.jpg`} alt='logo'id="conCon"/>
                    </a>
                </div>


                <div class = "worksLink">
                    <a href ="https://www.facebook.com/profile.php?id=100057044577232&mibextid=ZbWKwL">
                    <img src={`/images/facebookLogo.jpg`} alt='logo'id="greenLogoCon"/>
                    </a>
                </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Contact;
