import React, { Component } from 'react';

class Events extends Component {
    render() {
        /* Visual looks*/
        return (
            <div className="events">
                <h1>Come Join our Events</h1>
                <div class = "eveMenu">
                    <div class="eveWhiteLogo">
                    <img src={`/images/cheer_logo_white.jpg`} alt='logo' id='eveWhite'/>
                    </div>
                    {/*Join Event menu*/}

                    <div class = "selection">
                    <h2>Signup Here:</h2>
                        <h3>Please enter patient name:</h3>
                        <input type="text" id="patientName"/>
                        <h3>Please enter patient ID</h3>
                        <input type="text"id="patientID"/>
                        <h3>Date Selection:</h3>
                        <div class="eventDate">

                            <select name="year" id="eveYear">
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            </select>

                            <select name="month" id="eveMonth">
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            </select>

                            <select name="day" id="eveDay">
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">25</option>
                            <option value="19">26</option>
                            <option value="20">27</option>
                            <option value="21">28</option>
                            <option value="22">29</option>
                            <option value="23">30</option>
                            <option value="24">31</option>
                            </select>
                        </div>
                        
                        <h3>Event?</h3>
                        <select name="events"id="eveChoice">
                            <option value="event1">event1</option>
                            <option value="event2">event2</option>
                            <option value="event3">event3</option>
                            <option value="event4">event4</option>
                        </select>
                    </div>

                    <div class="eveGreenLogo">
                    <img src={`/images/cheer_logo.green.jpg`} alt='logo'id="eveGreen"/>
                    </div>
                </div>
                <div class="submitButton">
                    <button type="button" id="subEve">Submit Request</button>
                </div>
            </div>
        );
    }
}

export default Events;
