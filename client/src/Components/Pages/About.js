import React from "react";
function speak() {  
  // Create a SpeechSynthesisUtterance object

  const text = window.getSelection().toString() || "No text highlighted."
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
}


class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isSidebarOpen: false,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  readHighlightedText = () => {
    const text = window.getSelection().toString();
    if(text){
        speak(text);
    }
    else{
        window.speechSynthesis.cancel();
        speak("No text is highlighted");
    }
};

toggleSidebar(){
  this.setState({isSidebarOpen: !this.state.isSidebarOpen});
}

cancelSpeech = () => {
  window.speechSynthesis.cancel();
}


  render() {
    const { isSidebarOpen } = this.state;
    const dynamicStyle = {
      left: isSidebarOpen ? '60px' : '0px',
      transition: '0.5s',/* Animated transition for sidebar */

  }
    
    const address = "info@rockglen.com";
    return (
      <div>
        
        <button className="sidebar-toggle" style={dynamicStyle} onClick={this.toggleSidebar}>{isSidebarOpen ? <img src="/images/icons/close.png"></img> : <img src="/images/icons/sidebaropen.png"></img>}</button>
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

          
        <div className='speech-button'>
                        <button id="speech-btn" onClick={this.readHighlightedText}>
                            <img id="speaker" src='/images/icons/speech.png'></img></button>


             </div>
             <div className="cancel-speech">
                <button id="cancel-btn" onClick={this.cancelSpeech}>
                <img id="pause" src='/images/icons/pause.png'></img></button>
                </div>
             </div>
      <div className="about">
        <h1>About Us</h1>
        <img src="/images/GroupPic.jpg" alt="Group Picture" className='groupPic' />
        <div className="aboutDescription">
          <p>
              OLLI is a registered not-for-profit
              caregiver driven company with
              four areas of focus: Cheer Group;
              Cheer Works; Cheer Connections;
              and, Cheer Living.
          </p>
          <a className="CheerConnectionsButtonAbtPage" href="#cheerGroup">Cheer Group</a>
          <a className="CheerConnectionsButtonAbtPage" href="#cheerWorks">Cheer Works</a>
          <a className="CheerConnectionsButtonAbtPage" href="#cheerConnections">Cheer Connections</a>
          <a className="CheerConnectionsButtonAbtPage" href="#cheerLiving">Cheer Living</a>
        </div>

        <div className="cheerGroupSection" id="cheerGroup">
          <h1 >Cheer Group</h1>
          <p className="intro">
            Social, recreation, leisure, and
            friendship program for young adults
            with intellectual disabilities.
          </p>
          <div className="cheerGroupSectionExpandable">
            <p className="desc">
              The CHEER Group is a community of families supporting adults with higher functioning 
              intellectual disabilities. They share resources to hire support workers at a ratio of 
              4:1, making it more cost-effective. The program, funded through Passport funding, offers 
              various activities and outings for attendees to engage with friends and the wider community. 
              Participants must be capable of self-care, and caregivers are encouraged to be involved 
              in their loved one's progress and the group's activities. The group emphasizes building 
              life, social, and leisure skills while promoting inclusion in the community. They operate 
              from a clubhouse at Rock Glen Family Resort, utilizing its amenities, and follow a preset 
              calendar of events. The name "CHEER" reflects their mission of providing joy, praise, comfort, 
              and support to their members.
            </p>
          </div>
          <br></br>
          <button className="expandCheerGroupSection" onClick={() => {
            const expandableSection = document.querySelector('.cheerGroupSectionExpandable');
            expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
            }}>
              Expand/Collapse
          </button>
        </div>
        <br></br>
        <div className="cheerWorksSection" id="cheerWorks">
          <h1 >Cheer Works</h1>
          <p className="intro">
            Assisted employment for CHEER
            Group members providing an
            opportunity to gain job skills
            and income. There are many
            different jobs available
            considering differing abilities.
          </p>
          <div className="cheerWorksSectionExpandable">
            <p className="desc">
              In June, 2023, we opened an
              ice cream/variety store called
              Cheer Canteen and Roxy's
              Putter Golf course at Rock
              Glen Resort, in Arkona, open
              street side to the public as
              well as the camp, so please
              come by and support us if
              you are in the area. CHEER Works w employs
              members of the CHEER Group who have been
              developing their job skills. This is a safe and assisted
              working environment providing paid employment for
              our community members with intellectual disabilities.
              Caregivers and community supporter volunteer to
              help with this initiative. There are many different jobs
              to be done. Everyone enjoys working together and we
              have a great team!
            </p>
          </div>
          <br></br>
          <button className="expandCheerWorksSection" onClick={() => {
            const expandableSection = document.querySelector('.cheerWorksSectionExpandable');
            expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
            }}>
              Expand/Collapse
          </button>
          </div>
          <br></br>
          <div className="cheerConnectionsSection" id="cheerConnections">
            <h1>Cheer Connections</h1>
            <p className="intro">
              Caregiver social and support
              group, creators and administrators
              of all things C.H.E.E.R.
            </p>
            <div className="cheerConnectionsSectionExpandable">
              <p className="desc">
                Cheer Connections is a caregiver support group established in 
                February 2021, with their first in-person meeting held in November 
                2021 after pandemic restrictions eased. The group, consisting of 
                parents and caregivers of individuals with intellectual disabilities, 
                meets monthly to provide mutual support and exchange knowledge. Their 
                winter meetings, sponsored by the Ontario Caregivers Association, 
                feature relaxing activities, lunches, and guest speakers. They regularly 
                organize workshops to address concerns such as ODSP, housing, and employment 
                for their loved ones. Participation in Cheer Connections is mandatory for 
                families involved with the CHEER Group, emphasizing community engagement and 
                inclusion. Supported by various organizations and donors, they also offer social 
                activities and respite care for caregivers during meetings.
              </p>
            </div>
            <br></br>
            <button className="expandCheerConnectionsSection" onClick={() => {
              const expandableSection = document.querySelector('.cheerConnectionsSectionExpandable');
              expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
              }}>
                Expand/Collapse
            </button>
          </div>
          <br></br>
          <div className="cheerLivingSection" id="cheerLiving">
            <h1 >Cheer Living</h1>
            <p className="intro">
              An opportunity to practice
              independent living skills and living
              with minimal supports.
            </p>
            <div className="cheerLivingSectionExpandable">
              <p className="desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id 
                est laborum.
              </p>
            </div>
            <br></br>
            <button className="expandCheerLivingSection" onClick={() => {
              const expandableSection = document.querySelector('.cheerLivingSectionExpandable');
              expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
              }}>
                Expand/Collapse
            </button>
          </div>
      </div>
      </div>
    );
  }
}

export default About;
