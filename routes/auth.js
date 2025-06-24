const AuthController = require('../controllers/user') 
const express = require('express')
const router = express.Router()
const Votes = require('../controllers/votes')
const JWT = require('../helpers/jwt')
// const AuthController = require('../controllers/auth_controller')

// POST REQUESTS
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/add-votes', Votes.postVote);
router.post('/verify', JWT.verifyAccessToken)

// GET REQUESTS
router.get('/votes', Votes.totalVotes);
router.get('/figures', Votes.votesFigures)
router.get('/percentage', Votes.percentageVotes)
router.get('/allvotes', Votes.regionalResults)
router.get('/allusers', AuthController.getAllUsers)
// router.get('/getuser', AuthController.getUser)
router.get('/user/:id', AuthController.getUser)
router.get('/constituency-votes', Votes.getAllVotesWithConstituencies)

//UPDATE REQUEST
router.put("/disable/:id", AuthController.disableUser)
router.put('/editUser/:id', AuthController.editUser)
router.put("/forgot-password/:id", AuthController.forgotPassword)

module.exports = router;
