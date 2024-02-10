const express = require("express");
const router = express.Router();
const userRoutes = require('../server/users/index');
const departmentsRoutes = require('../server/departments/index');
const actionsRoutes = require('../server/actions/index');
const reportsRoutes = require('../server/reports/index');
const areassRoutes = require('../server/areas/index');
const reportFollowUpActions = require('../server/report_followup_actions');
const imagesRoutes = require('../server/images');


router.use('/users',userRoutes);
router.use('/departments',departmentsRoutes);
router.use('/actions',actionsRoutes);
router.use('/reports',reportsRoutes);
router.use('/areas',areassRoutes);
router.use('/reportFollowUpActions',reportFollowUpActions);
router.use('/images',imagesRoutes);

router.get('/',(req,res)=>{
    res.send("VFL_BE Server !");
});

router.get('/check',(req,res)=>{
    res.send("Check is also works !");
});



module.exports = router;