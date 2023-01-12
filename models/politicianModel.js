const mongoose = require("mongoose");

const politicianSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Politician = mongoose.model("politician", politicianSchema);

module.exports = Politician;