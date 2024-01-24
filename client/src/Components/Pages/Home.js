import React, { Component } from 'react';

class Home extends Component {
    render() {
        console.log("Displaying Home page");
        return (
            <div>
            <div class = "title">
                <h1>Welcome to the Homepage!</h1>
            </div>
            <div class ="opening">
                <div class = 'titles'>  
                <h2>About Us</h2>
                <h3>Vision Statement:</h3>
                <h4>To be a community of inclusion and a circle of friendship that supports and enhances
                    the lives of our loved one with intellectual disabilities as well as their whole family</h4></div>
                    <div class = 'openImage'>
                    <img src={`/images/placeholder.jpg`} alt='placeholder'/>
                    </div>

            </div>
            <div class = 'works'>
            <img src={'/images/placeholder.jpg'} alt='placeholder'/>
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
                <img src={`/images/cheer_logo.green.jpg`} alt='logo'/>
            </div>   

            <div class ="group1">
            <img src={`/images/cheer_logo_white.jpg`} alt='logo'/>
                <h4>CHEER Group consists 
                of families caring for an adult with higher functioning intellectual 
                disabilities. We pool our resources to share in hiring support 
                workers on a 4:1 ratio. Sharing support worker wages means it costs far less 
                than the usual 1:1 ratio. Many of our families feel 
                that, while support is definitely required, the level of 
                1:1 is not necessary and the 1:4 is plenty of support 
                for their person. We have two energetic full time 
                support staff, a part-time staff, and some volunteer 
                grade 12 students. Currently the rate is $13.50 per 
                hour, as more attend the rate goes down. The Cheer Group Program can be paid through Passport 
                funding! </h4>
            </div>

            <div class ="group2">
                <h4>The best part is that attendees are spending time 
                with their friends in their community! We follow a 
                preset calendar of events published in the month    
                prior. You sign up and pay for just what you use. 
                There are even times when you can request some 
                1:1 support if needed. 
                We have our club house located at Rock Glen Family 
                Resort and the use of their beautiful facilities, 
                including an indoor pool, sauna, fitness centre, hall, 
                and kitchen. Some of our projects are integrated 
                with the wider community and there are planned 
                special outings each month. We focus on building 
                life skills, social skills, and leisure skills. We aim to 
                build in as much community inclusion as possible 
                with a focus on the “normal”. </h4>
            <img src={'/images/placeholder.jpg'} alt='placeholder'/>
            </div>

            <div class ="group3">
            <img src={'/images/placeholder.jpg'} alt='placeholder'/>
                <h4>Attendees must be able to look after their own self-care needs. 
                    Caregivers must be engaged, and 
                    interested in their person’s success and the success 
                    of the group as a whole. Family get togethers and 
                    volunteering is a great part of this group.
                    We chose the name CHEER as the Webster 
                    dictionary gives the definition as “shout for joy, 
                    in praise or encouragement, give comfort and 
                    support to.” Which fits exactly our purpose. </h4>
            </div>

            <div class ="connections">
                <div class ='text'>    
              <h4>Cheer Connections, a caregiver support group, was formed in February, 2021, we had our first in person meeting on November 8, 2021, as soon as the pandemic restrictions allowed. 
                Cheer Connections is a group of parents and caregivers, some have adult children in the CHEER group and some don't, but we are all in a similar situation. We meet at least once a 
                month to offer each other support and share our knowledge. Our winter meetings were funded by the Ontario Caregivers Association, which provided a relaxing day, a nice lunch, 
                and great guest speakers. The Cheer Connections regularly gather for various workshops so that we may discuss information and learn together. We are all concerned 
                about ODSP, housing, employment, social opportunities, etc. and a lot of our energy is given to finding solutions for our loved ones' future. This group helps reduce isolation for 
                caregivers as well. It is a requirement of the CHEER Group that family members become involved with Cheer Connections. We are a close-knit social group that includes siblings, friends, and neighbours who care about 
                someone with an intellectual disability. We are committed to developing a community of inclusion. We are supported by Ontario Caregivers Association, Algarva 168, and private community member 
                donors. We also run various fundraisers and donations are accepted on line through Canada Helps. Looking for some social fun?… we have that too! Respite care is also available 
                so you don’t have to worry about your loved one while you attend meetings.</h4>  
                </div>
                <div class ='images'>
                <img src={`/images/connections_logo.jpg`} alt='logo'/>
                <img src={'/images/placeholder.jpg'} alt='placeholder'/>
                </div>
            </div>

            </div>
        );
    }
}

export default Home;
