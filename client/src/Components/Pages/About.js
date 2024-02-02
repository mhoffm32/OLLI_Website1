import React from "react";

class About extends React.Component {
  render() {
    const address = "info@rockglen.com";
    return (
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
          <p>
            Social, recreation, leisure, and
            friendship program for young adults
            with intellectual disabilities.
          </p>
          <div className="cheerGroupSectionExpandable">
          The CHEER Group is a community of families supporting adults with higher functioning intellectual disabilities. They share resources to hire support workers at a ratio of 4:1, making it more cost-effective. The program, funded through Passport funding, offers various activities and outings for attendees to engage with friends and the wider community. Participants must be capable of self-care, and caregivers are encouraged to be involved in their loved one's progress and the group's activities. The group emphasizes building life, social, and leisure skills while promoting inclusion in the community. They operate from a clubhouse at Rock Glen Family Resort, utilizing its amenities, and follow a preset calendar of events. The name "CHEER" reflects their mission of providing joy, praise, comfort, and support to their members.
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
          <p>
            Assisted employment for CHEER
            Group members providing an
            opportunity to gain job skills
            and income. There are many
            different jobs available
            considering differing abilities.
          </p>
          <div className="cheerWorksSectionExpandable">
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
          </div>
          <button className="expandCheerWorksSection" onClick={() => {
            const expandableSection = document.querySelector('.cheerWorksSectionExpandable');
            expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
            }}>
              Expand/Collapse
          </button>
        </div>
        <div className="cheerConnectionsSection" id="cheerConnections">
          <h1>Cheer Connections</h1>
          <p>
            Caregiver social and support
            group, creators and administrators
            of all things C.H.E.E.R.
          </p>
          <div className="cheerConnectionsSectionExpandable">
            Cheer Connections is a caregiver support group established in February 2021, with their first in-person meeting held in November 2021 after pandemic restrictions eased. The group, consisting of parents and caregivers of individuals with intellectual disabilities, meets monthly to provide mutual support and exchange knowledge. Their winter meetings, sponsored by the Ontario Caregivers Association, feature relaxing activities, lunches, and guest speakers. They regularly organize workshops to address concerns such as ODSP, housing, and employment for their loved ones. Participation in Cheer Connections is mandatory for families involved with the CHEER Group, emphasizing community engagement and inclusion. Supported by various organizations and donors, they also offer social activities and respite care for caregivers during meetings.
          </div>
          <button className="expandCheerConnectionsSection" onClick={() => {
            const expandableSection = document.querySelector('.cheerConnectionsSectionExpandable');
            expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
            }}>
              Expand/Collapse
          </button>
        </div>
        <div className="cheerLivingSection" id="cheerLiving">
          <h1 >Cheer Living</h1>
          <p>
            An opportunity to practice
            independent living skills and living
            with minimal supports.
          </p>
          <div className="cheerLivingSectionExpandable">

          </div>
          <button className="expandCheerLivingSection" onClick={() => {
            const expandableSection = document.querySelector('.cheerLivingSectionExpandable');
            expandableSection.style.display = expandableSection.style.display === 'none' ? 'block' : 'none';
            }}>
              Expand/Collapse
          </button>
        </div>
      </div>
    );
  }
}

export default About;
