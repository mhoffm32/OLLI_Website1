import React, { Component } from 'react';

class Fundraising extends Component {
    render() {
        const style = {
            width: '300px',
            height: '150px'
        };
        return (
            <div>
                <h1>Fundraising Page</h1>
                <p>Support O.L.L.I. by donating to our wonderful community programs!</p>
                <img src='\images\Sunset-Community-Foundation-Logo-Colour-1024x453.png' style={style}></img>
                <a href='https://sunsetcommunityfoundation.ca/'>Grand Bend Sunset Foundation</a>
                <br />
                <img src='/images/caregivers.jpg'></img>
                <a href='https://www.canadahelps.org/en/charities/the-ontario-caregiver-organization/'>Ontario Caregiver's Organization</a>
                <br/>
                <img src='/images/algarva.jpeg'></img>
                <a href='https://algarva168.org/'>Order of Alhambra, Algarva 168</a>
                <br/>
                <img src='/images/rockglen.jpeg'></img>
                <a href='https://www.rockglen.com/'>Rock Glen Resorts</a>



            </div>
        );
    }
}

export default Fundraising;
