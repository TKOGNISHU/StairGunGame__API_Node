const mongoose = require('mongoose')

const CharacterModel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'Coming soon' },
    srcConfig: { type: String, required: true },
})

module.exports = mongoose.model('characters', CharacterModel)
