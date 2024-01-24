import React, { Component } from 'react';

class Contact extends Component {
    render() {
        const emailAddress = "ihartmancheer@gmail.com";
        return (
            <div>
                <h1>Contact Page</h1>
                <p>If you are interested in the CHEER Program, CHEER Works, or CHEER connections, please contact:</p>
                <a href={`mailto:${emailAddress}`}>{emailAddress}</a>

            </div>
        );
    }
}

export default Contact;
