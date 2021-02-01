const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    title: String,
    publisher: String,
    onSale: Boolean,
    price: Number
});

module.exports = mongoose.model('Game', gameSchema);