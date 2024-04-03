import React, { Component } from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

function speak() {
  // Create a SpeechSynthesisUtterance object

  const text = window.getSelection().toString() || "No text is highlighted";
  const utterance = new SpeechSynthesisUtterance(text);

  // Speak the text
  window.speechSynthesis.speak(utterance);
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: null,
      isSidebarOpen: false,
      userDetails: {
        username: "",
        pfp: "",
      },
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  getUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`/user/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({
          userDetails: {
            username: data.username,
            pfp: data.pfp,
          },
        });
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  toggleSidebar() {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
  }

  getReviews = async () => {
    console.log("attempting to get reviews..");
    try {
      const response = await fetch("/getReviews");
      if (response.ok) {
        const data = await response.json();
        console.log("reviews:", data); // data is the array of reviews

        this.setState({ reviews: data }); // Directly use data here
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  readHighlightedText = () => {
    const text = window.getSelection().toString();
    if (text) {
      speak(text);
    } else {
      window.speechSynthesis.cancel();
      speak("No text is highlighted");
    }
  };

  cancelSpeech = () => {
    window.speechSynthesis.cancel();
  };

  createReview = async (username, date, rating, content) => {
    if (username === "") {
      console.error("Please log in before writing a review.");
      alert("Please log in before writing a review.");
      return;
    }
    try {
      const response = await fetch("/createReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, date, rating, content }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Review created successfully.");
        console.log(data.message);
        this.getReviews();
      } else if (data.message === "Bad input detected") {
        alert("Poor language detected! Please do not use profanity.");
      }
    } catch (error) {
      alert("Error creating review.");
      console.error("error:", error);
    }
  };

  componentDidMount() {
    this.getReviews();
    this.getUserDetails();
  }

  render() {
    const { isSidebarOpen } = this.state;
    const dynamicStyle = {
      left: isSidebarOpen ? "60px" : "0px",
      transition: "0.5s" /* Animated transition for sidebar */,
    };
    console.log("Displaying Home page");

    return (
      <div>
        <button
          className="sidebar-toggle"
          style={dynamicStyle}
          onClick={this.toggleSidebar}
        >
          {isSidebarOpen ? (
            <img src="/images/icons/close.png"></img>
          ) : (
            <img src="/images/icons/sidebaropen.png"></img>
          )}
        </button>
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="speech-button">
            <button id="speech-btn" onClick={this.readHighlightedText}>
              <img id="speaker" src="/images/icons/speech.png"></img>
            </button>
          </div>
          <div className="cancel-speech">
            <button id="cancel-btn" onClick={this.cancelSpeech}>
              <img id="pause" src="/images/icons/pause.png"></img>
            </button>
          </div>
        </div>

        <div className="homePage">
          <div className="homePageDescription">
            <h1>Ongoing Living & Learning Inc.</h1>
            <br></br>
            <a>
              A community of inclusion and a circle of friendship that supports
              and enhances the lives of our loved ones with intellectual
              disabilities as well as the whole family.
            </a>
          </div>
          <div className="cheer-desc">
            <div className="olliAspects">
              <div className="CheerConnectionsTitle">Cheer Connections</div>
              <div className="cheerConnectionsDescBack">
                <div className="CheerConnections">
                  <div className="CheerConnectionsDescription">
                    Caregiver social and support group, creators and
                    administrators of all things C.H.E.E.R.
                  </div>
                  <button
                    className="CheerConnectionsButton"
                    onClick={(evt) => this.props.changePage("About")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="olliAspects">
              <div className="CheerConnectionsTitle">Cheer Works</div>
              <div className="cheerWorksDescBack">
                <div className="CheerConnections">
                  <div className="CheerConnectionsDescription">
                    Assisted employment for CHEER Group members providing an
                    opportunity to gain job skills and income. There are many
                    different jobs available considering differing abilities.
                  </div>
                  <button
                    className="CheerConnectionsButton"
                    onClick={(evt) => this.props.changePage("About")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="olliAspects">
              <div className="CheerConnectionsTitle">Cheer Group</div>
              <div className="cheerGroupDescBack">
                <div className="CheerConnections">
                  <div className="CheerConnectionsDescription">
                    Social, recreation, leisure, and friendship program for
                    young adults with intellectual disabilities.
                  </div>
                  <button
                    className="CheerConnectionsButton"
                    onClick={(evt) => this.props.changePage("About")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="olliAspects">
              <div className="CheerConnectionsTitle">Cheer Living</div>
              <div className="cheerLivingDescBack">
                <div className="CheerConnections">
                  <div className="CheerConnectionsDescription">
                    An opportunity to practice independent living skills and
                    living with minimal supports.
                  </div>
                  <button
                    className="CheerConnectionsButton"
                    onClick={(evt) => this.props.changePage("About")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div className="newsUpload">
            <h1>Read our Newsletter of the Month: </h1>
            <div className="letterView">
              <iframe
                id="homeLetter"
                src="/images/February_OLLI_Newsletter (8).pdf"
                width="900px"
                height="500px"
              />
            </div>
          </div>
          <div className="review-section">
            <div className="review-desc">
              <h1>Hear from our Community</h1>
              <a>
                Here are some reviews from our members and their loved ones!
              </a>
            </div>
            <div className="reviews">
              {this.state.reviews &&
                this.state.reviews.map((review, index) => {
                  return (
                    <div key={index} className="review">
                      <div className="review-header">
                        <div className="review-username">
                          User: {review.username}
                        </div>
                        <div className="review-date">Date: {review.date}</div>
                      </div>
                      <div className="review-rating">
                        Rating: {review.rating} Star
                      </div>
                      <div className="review-content">
                        Review: {review.content}
                      </div>
                    </div>
                  );
                })}
            </div>
                <div className="review-section">
                    <div className="review-desc">
                        <h1>Hear from our Community</h1>
                        <a>Here are some reviews from our members and their loved ones!</a>
                    </div>
                    <div className="reviews">
                        {this.state.reviews && this.state.reviews.map((review, index) => {
                            return (
                                <div key={index} className="review">
                                    <div className="review-header">
                                        <div className="review-username"><strong>User:</strong> {review.username}</div>
                                        <div className="review-date"><strong>Date:</strong> {review.date}</div>
                                    </div>
                                    <div className="review-rating"><strong>Rating:</strong> {review.rating} <img src="/images/icons/star.png"/></div>
                                    <div className="review-content"><strong>Review:</strong> {review.content}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="review-form">
                        <h1>Write a Review</h1>
                        <form className="review-form1" onSubmit={evt => {
                            evt.preventDefault();
                            const username = this.state.userDetails.username;
                            const date = format(new Date(), 'MMMM dd, yyyy');
                            const rating = evt.target.rating.value;
                            const content = evt.target.content.value;
                            this.createReview(username, date, rating, content);
                        }}>
                            <label>Rating: </label>
                            <input type="number" name="rating" min="1" max="5" required className="review-stars"/>
                            <br></br>
                            <label>Review: </label>
                            <textarea name="content" required className="review-text"></textarea>
                            <br></br>
                            <button type="submit" className="review-submit">Submit</button>
                        </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
