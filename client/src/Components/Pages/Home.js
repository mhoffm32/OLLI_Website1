import React, { Component } from "react";

class Home extends Component {
    render() {
        console.log("Displaying Home page");
        return (
            <div>
            <div class = "title">
                <h1>Welcome to the Homepage!</h1>
            </div>
            <div class ="opening">  
                <h2>About Us</h2>
                <h3>Vision Statement:</h3>
                <h4>To be a community of inclusion and a circle of friendship that supports and enhances
                    the lives of our loved one with intellectual disabilities as well as their whole family</h4>
                    <img src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`} alt='placeholder'/>

            </div>
            <div class = 'history'>
            <img src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`} alt='placeholder'/>
                <h4>In June, 2023, we opened an ice cream/variety store called 
                    Cheer Canteen and Roxy's Putter Golf course at Rock 
                    Glen Resort, in Arkona, open street side to the public as 
                    well as the camp. CHEER Works employs 
                    members of the CHEER Group who have been 
                    developing their job skills. This is a safe and assisted 
                    working environment providing paid employment for 
                    our community members with intellectual disabilities. 
                    Caregivers and community supporter volunteer to 
                    help with this initiative. Everyone enjoys working together and we 
                    have a great team! </h4>
                <img src={`${process.env.PUBLIC_URL}/images/cheer_logo.green.jpg`} alt='logo'/>
            </div>    
            </div>
        );
    }
}

export default Home;
