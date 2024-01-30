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
                <a className={activeOption === 'Home' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>Home</a>
                <a className={activeOption === 'News' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>News</a>
                <a className={activeOption === 'Events' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>Events</a>
                <a className={activeOption === 'Fundraising' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>Fundraising</a>
                <a className={activeOption === 'Contact' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>Contact</a>
                <a className={activeOption === 'About' ? 'active' : ''} onClick={evt => this.props.changePage(evt)}>About</a>
                <button className="login" onClick={evt => this.props.changePage(evt)}>Login</button>
                <button className="signup" onClick={evt => this.props.changePage(evt)}>Sign Up</button>
            </div>
        );
    }
}

export default NavigationBar;