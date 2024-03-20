const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.route('/user/nonStaffUsers') 
    .get(async (req, res) => {
        try {
            const nonStaffUsers = await User.find({type: "generalUser"});
            res.json(nonStaffUsers);
        } catch (error) {
            console.error('Error fetching general users:', error);
            throw error;
        }
    });

router.route('/user/makeUserStaff')
    .post(async(req, res) =>{
        try{
            const {username} = req.body;
            console.log('you pressed approve or deny')
            const user1 = await User.findOne({username: username});
            if(user1)
            {
                user1.type='employee';
                console.log(user1)
            }
            await user1.save();
            console.log(user1)
            res.status(200).json({ message: `User is now a staff member.` });
        }
        catch (error) {
            console.error('Error Approving as Staff:', error);
            res.status(500).send('Cannot make this user a staff member.');
        }
    })


module.exports = router;