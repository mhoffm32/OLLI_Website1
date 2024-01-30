import React, { Component } from 'react';

class Request extends Component {
    render() {
        return (
            <div>
                
                <h1>Request a Caretaker</h1>
                {/* Add your news content here */}
            <div class = "reqMenu">
                <div class="reqWhiteLogo">
                <img src={`/images/cheer_logo_white.jpg`} alt='logo' id='reqWhite'/>
                </div>

                <div class = "selection">
                    <h3>Please enter patient name:</h3>
                    <input type="text" id="patientName"/>
                    <h3>Please enter patient ID</h3>
                    <input type="text"id="patientID"/>
                    <h3>What caretaker would you like?</h3>
                    <select name="caretakers"id="ctChoice">
                        <option value="caretaker1">Caretaker1</option>
                        <option value="caretaker2">Caretaker2</option>
                        <option value="caretaker3">Caretaker3</option>
                        <option value="caretaker4">Caretaker4</option>
                    </select>
                </div>

                

                <div class="reqGreenLogo">
                <img src={`/images/cheer_logo.green.jpg`} alt='logo'id="reqGreen"/>
                </div>
                </div>

                <div class="requestButton">
                    <button type="button" id="subReq">Submit Request</button>
                </div>

            </div>
        );
    }
}

export default Request;
