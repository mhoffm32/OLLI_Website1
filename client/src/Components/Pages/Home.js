import React, { Component } from "react";

class Home extends Component {
    render() {
        console.log("Displaying Home page");
        return (
            <div className="homePage">
                <div className="homePageDescription">
                <h1>Ongoing Living & Learning Inc.</h1>
                <br></br>
                <a>A community of inclusion and
                    a circle of friendship that supports
                    and enhances the lives of our loved
                    ones with intellectual disabilities as
                    well as the whole family.
                </a>
                </div>
                <div className="olliAspects">
                    <div className="CheerConnectionsTitle">
                        Cheer Connections
                    </div>
                    <div className="CheerConnections">
                        <div className="CheerConnectionsDescription">
                            Caregiver social and support
                            group, creators and administrators
                            of all things C.H.E.E.R.
                        </div>
                        <button className="CheerConnectionsButton" onClick={evt => this.props.changePage('About')}>Learn More</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
