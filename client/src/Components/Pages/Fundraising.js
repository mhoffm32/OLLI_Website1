import React, { Component } from 'react';

class Fundraising extends Component {
    render() {
        const style = {
            width: '300px',
            height: '150px'
        };
        return (
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
        );
    }
}

export default Fundraising;
