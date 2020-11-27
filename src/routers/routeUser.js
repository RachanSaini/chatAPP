const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const router = new express.Router()


//User Registration
router.post('/add', async (req, res) => {
    const user = new User(req.body)
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
      res.clearCookie('token');
      res.send({})
  } catch (e) {
      res.status(500).send()
  }
})

// router.patch('/users/me', auth, async (req, res) => {
//   const updates = Object.keys(req.body)
//   const allowedUpdates = ['name', 'email', 'password']
//   const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//   if (!isValidOperation) {
//       return res.status(400).send({ error: 'Invalid updates!' })
//   }

//   try {
//       updates.forEach((update) => req.user[update] = req.body[update])
//       await req.user.save()
//       res.send(req.user)
//   } catch (e) {
//       res.status(400).send(e)
//   }
// })

module.exports = router
