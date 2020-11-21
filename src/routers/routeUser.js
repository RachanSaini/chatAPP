const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const router = new express.Router()


//User Registration
router.post('/add', (req, res) => {
    let user = new User(req.body)
    user.save()
    .then(item =>{
      user.generateAuthToken()
      .then(token => {
        res.send({ 'user' : item, token });
      })
    })
    .catch(err =>{
      res.status(400).send(err);
    });
})

module.exports = router
