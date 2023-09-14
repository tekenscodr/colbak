const Report = require('../models/report')
const User = require('../models/user');

module.exports = {
    allReports: async(req, res, next) => {
        try{
            const reports = await Report.find().populate('reportedBy').exec();
            return res.status(201).json({reports})
        }catch (error){
            console.log("Error getting report", error);
            return res.status(500).json()
        }
    }
}