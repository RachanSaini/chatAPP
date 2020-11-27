const express = require('express')
const Message = require('../models/messageModel')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/messages', auth, async (req, res) => {
    const message = new Message({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router
