const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    value: { type: Number, required: true },
    type: { type: String, required: true }, // hp/sta/atk/def/luk/agi
})

module.exports = propertySchema
