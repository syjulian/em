var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    companyname: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/},
    phone: {type: String, match: /^\d{10}$/},
    password: {type: String},
});
employeeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Employee', employeeSchema);
