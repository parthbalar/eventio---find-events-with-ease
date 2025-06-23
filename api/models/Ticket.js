const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  eventid: { type: String, required: true },
  ticketDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventname: { type: String, required: true },
    eventdate: { type: Date, required: true },
    eventtime: { type: String, required: true },
    ticketprice: { type: Number, required: true },
    qr: { type: String, required: true },
    selectedSeats: { type: [String], required: true },
    tickets: { type: Number, required: true },          
  },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TicketModel = mongoose.model("Ticket", ticketSchema);
module.exports = TicketModel;
