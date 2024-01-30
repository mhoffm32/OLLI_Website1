import React from 'react';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOption: props.activeOption
        };

    }

    render() {
        const { activeOption } = this.props;
        return (
            <div className="topnav">
                <a className={activeOption === 'Home' ? 'active' : ''} onClick={evt => this.props.changePage('Home')}>Home</a>
                <a className={activeOption === 'News' ? 'active' : ''} onClick={evt => this.props.changePage('News')}>News</a>
                <a className={activeOption === 'Events' ? 'active' : ''} onClick={evt => this.props.changePage('Events')}>Events</a>
                <a className={activeOption === 'Fundraising' ? 'active' : ''} onClick={evt => this.props.changePage('Fundraising')}>Fundraising</a>
                <a className={activeOption === 'Contact' ? 'active' : ''} onClick={evt => this.props.changePage('Contact')}>Contact</a>
                <a className={activeOption === 'About' ? 'active' : ''} onClick={evt => this.props.changePage('About')}>About</a>
                <button className="login" onClick={evt => this.props.changePage('Login')}>Login</button>
                <button className="signup" onClick={evt => this.props.changePage('Sign Up')}>Sign Up</button>
            </div>
        );
    }
}

export default NavigationBar;