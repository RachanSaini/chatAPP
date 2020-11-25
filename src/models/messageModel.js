const mongoose = require("mongoose")

const db=mongoose.connection
db.on('error', console.log.bind(console, "connection error"))
db.once('open', function(callback){
    console.log("connection succeeded")
})

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{
  timestamps: true 
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message

