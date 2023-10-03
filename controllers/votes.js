const createError = require('http-errors')
const Vote = require('../models/votes')
const Users = require('../models/user')
const axios = require('axios')
const { json } = require('express')
const multer = require('multer');
const { any } = require('joi')
const storage = multer.memoryStorage(); // This stores the file in memory as a buffer
const upload = multer({ storage: storage });


module.exports = {
    // ALL VOTES CAST FOR EACH CANDIDATE
    
    ken : async (req, res, next) => { 
      try {
        const name = await Vote.votes.name
        console.log(name);
        const totalVotes = await Vote.find({name : 'Kennedy Agyepong'} , (err, votes) => {
            if (err){
                res.status(400).json({message: err})
            }
            return res.status(200).json({totalVotes})
        })
      } catch (error) {
        if (error === true) error.status = 422;
        res.status(422).json({error: error.message})
        next(error)
      }
    },
    // const Vote = require('./your-vote-model'); // Replace with the correct path to your vote model
  
    //  TOTAL NUMBER OF VOTES
  totalVotes: async(req, res, next) => {
    try {
      const data = await Vote.find(); 

      const result = data.reduce((totals, obj) => {
        obj.votes.forEach(vote => {
          const { name, count } = vote;
          totals[name] = ((totals[name] || 0) + count);
          totals.totalVotes = (totals.totalVotes || 0) + count;
        });
        return totals;
      }, {});

      return res.status(200).json(result);

    } catch (error) {
      
    }
  },
  // TOTAL VOTES IN PERCENTAGE
  percentageVotes : async(req, res, next) => {
    try {
      const data = await Vote.find(); 
      const result = data.reduce((totals, obj) => {
        obj.votes.forEach(vote => {
          const { name, count } = vote;
          totals[name] = ((totals[name] || 0) + count);
          totals.totalVotes = (totals.totalVotes || 0) + count;
        });
        return totals;
      }, {});
      const percentages = {};
      for (const candidate in result) {
        if (candidate !== 'totalVotes') {
          const voteCount = result[candidate];
          const percentage = (voteCount / result.totalVotes) * 100;
          percentages[candidate] = parseFloat(percentage.toFixed(2));
        }
      }
      return res.status(200).json(percentages);
    } catch (error) {
      next(error)
    }
  },
  votesFigures : async(req,res, next) => {
    try {
      const data = await Vote.find(); 
      const result = data.reduce((totals, obj) => {
        obj.votes.forEach(vote => {
          const { name, count } = vote;
          totals[name] = ((totals[name] || 0) + count);
          totals.totalVotes = (totals.totalVotes || 0) + count;
        });
        return totals;
      }, {});
      const inFigures = {};
      for (const candidate in result) {
        if (candidate !== 'totalVotes') {
          const voteCount = result[candidate];
          inFigures[candidate] = voteCount;
        }
      }
      return res.status(200).json(inFigures);
    } catch (error) {
      next(error)
    }
  },
  //Percentages of each region
  regionPercentageVotes : async(req, res, next) => {
    try {
      const person = await User.find();
      const data = await Vote.find(); 
      const result = data.reduce((totals, obj) => {
        obj.votes.forEach(vote => {
          const { name, count } = vote;
          totals[name] = ((totals[name] || 0) + count);
          totals.totalVotes = (totals.totalVotes || 0) + count;
        });
        return totals;
      }, {});
      const percentages = {};
      for (const candidate in result) {
        if (candidate !== 'totalVotes') {
          const voteCount = result[candidate];
          const percentage = (voteCount / result.totalVotes) * 100;
          percentages[candidate] = parseFloat(percentage.toFixed(2));
        }
      }
      return res.status(200).json(percentages);
    } catch (error) {
      next(error)
    }
  },

  //CHECK FOR REGIONAL 
  regionalResults: async(req, res, next ) => {
    try {
      const user = await Vote.find({}).populate({
        path: "agent",
        select: "constituency",
      })
      // const constituency = await Users.find({_id:user.agent})

      // const result = await Promise.all(constituency.map(async ticket => {
      //       const event = await Event.findOne({
      //           _id:mongoose.Types.ObjectId(ticket.eventId)
      //       }).lean()
      //  }))
      console.log(user)
      return
    } catch (error) {
      next(error)
    }
  },

  getAllVotesWithConstituencies: async ( req, res, next) => {
    try {
      // Fetch all votes
      const allVotes = await Vote.find();
      // Initialize an array to store results
      const result = [];
      // For each vote, find the corresponding user and get their constituency
      for (const vote of allVotes) {
        const user = await Users.findOne({ _id: vote.agent });
        if (user) {
          // Add the user's constituency to the vote data
          vote.agent = user.constituency;
          result.push(vote);
        }
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching votes with constituencies:', error);
      throw error;
    }
  },
  
  // Usage example
  // getAllVotesWithConstituencies()
  //   .then((votesWithConstituencies) => {
  //     console.log(votesWithConstituencies);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  

  // Define storage for uploaded images


  postVote : async(req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
      const imageBuffer = req.file.buffer;
      const result = await req.body;
      const votesCast = new Vote(result)
      const savedVotes = await votesCast.save();
      return res.status(200).json(savedVotes)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
  }
}