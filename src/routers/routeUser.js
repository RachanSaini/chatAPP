const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const router = new express.Router()
const parser = require('cookie-parser')


//User Registration
router.post('/add', async (req, res) => {
    const user = new User(req.body)
    // user.save()
    // .then(item =>{
    //   user.generateAuthToken()
    //   .then(token => {
    //     res.send({ 'user' : item, token });
    //   })
    // })
    // .catch(err =>{
    //   res.status(400).send(err);
    // });
    try {
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
      
    } catch (e) {
      res.status(400).send(e)
    }
})

//Login user
router.post('/login', async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      res.send({ user, token })
      const cookie = parser.JSONCookie(user.token)
      console.log(cookie)
  } catch (e) {
      res.status(400).send()
  }
})

router.post('/logout', auth , async (req, res) => {
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.user.save()

      res.send()
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router
