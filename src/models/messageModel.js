const mongoose = require("mongoose")

const db=mongoose.connection
db.on('error', console.log.bind(console, "connection error"))
db.once('open', function(callback){
    console.log("message db connection succeeded")
})

const messageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message

