import React, { Component } from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';

function speak() {  
    // Create a SpeechSynthesisUtterance object
  
    let text = "Welcome to the O living learning homepage"
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviews: null,
            userDetails: {
                username: '',
                pfp: ''
            }
        }
    }

    getUserDetails = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`/user/details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                this.setState({ userDetails: {
                    username: data.username,
                    pfp: data.pfp,
                }});
            } else {
                console.error('Failed to fetch user details:', response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    getReviews = async () => {
        console.log("attempting to get reviews..");
        try {
            const response = await fetch('/getReviews');
            if (response.ok) {
                const data = await response.json();
                console.log("reviews:", data); // data is the array of reviews
    
                this.setState({ reviews: data }); // Directly use data here
            }
        } catch (error) {
            console.error("error:", error);
        }
    };
    
    createReview = async (username, date, rating, content) => { 
        if (username === '') {
            console.error("Please log in before writing a review.");
            alert("Please log in before writing a review.");
            return;
        }
        try {
            const response = await fetch('/createReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, date, rating, content })
            });
            if (response.ok) {
                const data = await response.json();
                alert("Review created successfully.");
                console.log(data.message);
                this.getReviews();
            }
        } catch (error) {
            alert("Error creating review.")
            console.error("error:", error);
        }
    }

    componentDidMount() { 
        this.getReviews();
        this.getUserDetails();
    }

    render() {
        speak();
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
                <div className="cheer-desc">
                    <div className="olliAspects">
                        <div className="CheerConnectionsTitle">
                            Cheer Connections
                        </div>
                        <div className='cheerConnectionsDescBack'>
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
                    <div className="olliAspects">
                        <div className="CheerConnectionsTitle">
                            Cheer Works
                        </div>
                        <div className='cheerWorksDescBack'>
                        <div className="CheerConnections">
                            <div className="CheerConnectionsDescription">
                                Assisted employment for CHEER
                                Group members providing an
                                opportunity to gain job skills
                                and income. There are many
                                different jobs available
                                considering differing abilities.
                            </div>
                            <button className="CheerConnectionsButton" onClick={evt => this.props.changePage('About')}>Learn More</button>
                        </div>
                        </div> 
                    </div>
                    <div className="olliAspects">
                        <div className="CheerConnectionsTitle">
                            Cheer Group
                        </div>
                        <div className='cheerGroupDescBack'>
                            <div className="CheerConnections">
                                <div className="CheerConnectionsDescription">
                                    Social, recreation, leisure, and
                                    friendship program for young adults
                                    with intellectual disabilities.
                                </div>
                                <button className="CheerConnectionsButton" onClick={evt => this.props.changePage('About')}>Learn More</button>
                            </div>
                        </div>
                    </div>
                    <div className="olliAspects">
                        <div className="CheerConnectionsTitle">
                            Cheer 
                            Living
                        </div>
                        <div className='cheerLivingDescBack'>
                            <div className="CheerConnections">
                                <div className="CheerConnectionsDescription">
                                    An opportunity to practice
                                    independent living skills and living
                                    with minimal supports.
                                </div>
                                <button className="CheerConnectionsButton" onClick={evt => this.props.changePage('About')}>Learn More</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="review-section">
                    <div className="review-desc">
                        <h1>Hear from our Community</h1>
                        <a>Here are some reviews from our members and their families</a>
                    </div>
                    <div className="reviews">
                        {this.state.reviews && this.state.reviews.map((review, index) => {
                            return (
                                <div key={index} className="review">
                                    <div className="review-header">
                                        <div className="review-username">User: {review.username}</div>
                                        <div className="review-date">Date: {review.date}</div>
                                    </div>
                                    <div className="review-rating">Rating: {review.rating}</div>
                                    <div className="review-content">{review.content}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="review-form">
                        <h1>Write a Review</h1>
                        <form onSubmit={evt => {
                            evt.preventDefault();
                            const username = this.state.userDetails.username;
                            const date = format(new Date(), 'MMMM dd, yyyy');
                            const rating = evt.target.rating.value;
                            const content = evt.target.content.value;
                            this.createReview(username, date, rating, content);
                        }}>
                            <label>Rating: </label>
                            <input type="number" name="rating" min="1" max="5" required/>
                            <br></br>
                            <label>Review: </label>
                            <textarea name="content" required></textarea>
                            <br></br>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <br></br>
                    <br></br>
                </div>
                <div className="newsUpload">
                    <div className="newsTitle">NewsLetter of the month: </div>
                        <div className="letterView">
                            <iframe id="homeLetter" src="/images/February_OLLI_Newsletter (8).pdf" width="900px" height="500px" />
                        </div>
                </div>
            </div>
        );
    }
}

export default Home;
