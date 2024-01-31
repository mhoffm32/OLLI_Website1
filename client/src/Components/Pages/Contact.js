import React, { Component } from 'react';

class Contact extends Component {
    render() {
        const emailAddress = "ihartmancheer@gmail.com";
        const facebook ="https://www.facebook.com/cheer.2023?mibextid=ZbWKwL"
        const conectionFB ="https://www.facebook.com/familyconnectionscheer?mibextid=ZbWKwL"
        const worksFB ="https://www.facebook.com/profile.php?id=100057044577232&mibextid=ZbWKwL"
        return (
            <div>
                <h1>Contact Page</h1>

                <div class = "contacts1">
                <div class="repEmail">
                <img src={`/images/placeholder.jpg`} alt='logo'id="placeholderCon"/>
                    <h4>If you are interested in the CHEER and it's activities, please contact:</h4>
                    <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                </div>
                

                <div class="fbLink">
                <img src={`/images/facebook.jpg`} alt='logo'id="logoFB"/>
                    <h4>CHEER facebook page:</h4>
                    <a href={`malito:${facebook}`}>{facebook}</a>
                </div>
                </div>
                
                <div class = "contacts2">
                <div class = "connectionsLink">
                <img src={`/images/connections_logo.jpg`} alt='logo'id="conCon"/>
                    <h4>CHEER Connections on Facebook: </h4>
                    <a href ={`malito:${conectionFB}`}>{conectionFB}</a>
                </div>


                <div class = "worksLink">
                    <img src={`/images/cheer_logo.green.jpg`} alt='logo'id="greenLogoCon"/>
                        <h4>CHEER Works on Facebook: </h4>
                        <a href ={`malito:${worksFB}`}>{worksFB}</a>
                </div>
                </div>

            </div>
        );
    }
}

export default Contact;
