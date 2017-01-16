var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    displayname: {type: String, required: true},
    companyname: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9_]*$/
    },
    password: {type: String, required: true }
});
companySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Company', companySchema);
