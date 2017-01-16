var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/api', router);

mongoose.Promise = global.Promise;
mongoose.connect(require('./config/db').url);

var JWT_SECRET = 'secretsecretsecret';

var Employee = require('./models/employee');
var Company = require('./models/company');
app.use(express.static('public'));

// Routes
router.route('/login')
.post(function(req, res) {
    if(!req.body.companyname || !req.body.password) {
        return res.status(400).send();
    }

    Company.findOne({companyname: req.body.companyname.toLowerCase()}, function(err, company) {
        if(err || !company) return res.status(401).send();

        bcrypt.compare(req.body.password, company.password, function(err, result) {
            if(result) return res.json({token: jwt.encode(company, JWT_SECRET)});
            else return res.status(401).send();
        });
    });
});

router.route('/companys')
.post(function(req, res) {
    Company.findOne({companyname: req.body.companyname}, function(err, company) {
        if(err || company) return res.status(401).send();

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(!req.body.companyname || !req.body.password || !req.body.displayname) {
                    return res.status(400).send();
                }

                var company = new Company();
                company.companyname = req.body.companyname.toLowerCase();
                company.password = hash;
                company.displayname = req.body.displayname;
                company.save(function(err) {
                    if(err) res.status(500).send(err);
                    else res.json({message: 'Company created!' });
                });
            });
        });
    });
})
.get(function(req, res) {
    Company.find(function(err, companys) {
        if(err) res.send(err);
        else {
            res.json(companys.map(function(company) {
                delete company.password;
                return company;
            }));
        }
    });
});

router.route('/companys/:companyname/employees')
.post(function(req, res) {
    var token = req.headers.authorization;
    if(!token) {
        return res.status(401).send();
    }
    var company = jwt.decode(token, JWT_SECRET);

    if(company.companyname !== req.params.companyname) {
        return res.status(401).send();
    }

    var employee = new Employee()
    employee.companyname = company.companyname;
    employee.name = req.body.name;
    employee.phone = req.body.phone;
    employee.email = req.body.email;

    employee.save(function(err) {
        if(err) res.send(err);
        else res.json({message: 'Employee created!' });
    });
})
.get(function(req, res) {
    Employee.find({companyname: req.params.companyname}, function(err, employees) {
        if(err) {
            return res.send(err);
        } else {
            return res.json(employees);
        }
    });
});

router.route('/companys/:companyname/employees/:employee_id')
.get(function(req, res) {
    Employee.findById(req.params.employee_id, function(err, employee) {
        if(err) res.send(err);
        res.json(employee);
    });
})
.put(function(req, res) {
    var token = req.headers.authorization;
    var company = jwt.decode(token, JWT_SECRET);

    if(company.companyname !== req.params.companyname) {
        return res.status(401).send();
    }
    Employee.findById(req.params.employee_id, function(err, employee) {
        employee.name = req.body.name;
        employee.phone = req.body.phone;
        employee.email= req.body.email;

        employee.save(function(err) {
         if(err) {
             res.send(err);
         } else {
             res.json({message: 'Employee updated!' });
         }
     });
    });
})
.delete(function(req, res) {
    var token = req.headers.authorization;
    var company = jwt.decode(token, JWT_SECRET);

    if(company.companyname !== req.params.companyname) {
        return res.status(401).send();
    }

    Employee.remove({
        _id: req.params.employee_id
    }, function(err, employee) {
        if(err) res.send(err);
        res.json({message: 'Successfully deleted'});
    });
});
// End Routes

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
