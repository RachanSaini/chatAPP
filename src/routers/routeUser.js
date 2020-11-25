const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const router = new express.Router()


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
      res.cookie('token',token, { maxAge: 900000, httpOnly: true });
      console.log(token);
      res.json({ user, token })

  } catch (e) {
      res.status(400).send(e)
  }
})

router.post('/logout', auth , async (req, res) => {
  try {
      //let token = req.cookies.token;
      // req.user.tokens = req.user.tokens.filter((token) => {
      //     return token.token !== token
      // })
      // await req.user.save()
      res.clearCookie('token');
      res.send({})
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router
