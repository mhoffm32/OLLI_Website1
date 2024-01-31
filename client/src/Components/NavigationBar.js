import React from 'react';
import GLogin from "./Pages/GLogin";
import { jwtDecode } from 'jwt-decode';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOption: props.activeOption
        };

    }

    render() {
        const { activeOption } = this.props;

        const token = localStorage.getItem('jwt');

        return (
            <div className="topnav">
                <a className={activeOption === 'Home' ? 'active' : ''} onClick={evt => this.props.changePage('Home')}>
                    <img src={activeOption === 'Home' ? '/images/icons/house-green.png' : '/images/icons/house.png'} className="nav-icon" alt="Home" />
                    Home
                </a>                
                <a className={activeOption === 'News' ? 'active' : ''} onClick={evt => this.props.changePage('News')}>
                    <img src={activeOption === 'News' ? "/images/icons/news-green.png" : '/images/icons/news.png'} className="nav-icon" alt="News" />
                    News
                </a>
                <a className={activeOption === 'Events' ? 'active' : ''} onClick={evt => this.props.changePage('Events')}>
                    <img src={activeOption === 'Events' ? "/images/icons/event-green.png" : '/images/icons/event.png'} className="nav-icon" alt="Events" />
                    Events
                </a>
                <a className={activeOption === 'Fundraising' ? 'active' : ''} onClick={evt => this.props.changePage('Fundraising')}>
                    <img src={activeOption === 'Fundraising' ? "/images/icons/handholdingheart-green.png" : "/images/icons/handholdingheart.png"} className="nav-icon" alt="Fundraising" />
                    Fundraising
                </a>
                <a className={activeOption === 'Contact' ? 'active' : ''} onClick={evt => this.props.changePage('Contact')}>
                    <img src={activeOption === 'Contact' ? "/images/icons/mail-green.png" : '/images/icons/mail.png'} className="nav-icon" alt="Contact"/>
                    Contact
                </a>
                <a className={activeOption === 'About' ? 'active' : ''} onClick={evt => this.props.changePage('About')}>
                    <img src={activeOption === 'About' ? "/images/icons/about-green.png" : '/images/icons/about.png'} className="nav-icon" />
                    About
                </a>

                <GLogin/>

                <a className={activeOption === 'Verification' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>
                    <img src={activeOption === 'Verification' ? "/images/icons/verify-green.png" : '/images/icons/verify.png'} className="nav-icon" alt='Verification'/>
                    Verification
                </a>
                
                {token ? (
                    <b className="username">{jwtDecode(token).username}</b>
                ) : (
                    <>
                        <button className="login" onClick={evt => this.props.changePage('Login')}>Login</button>
                        <button className="signup" onClick={evt => this.props.changePage('Sign Up')}>Sign Up</button>
                    </>
                )}
             
            </div>

        );
    }
}

export default NavigationBar;