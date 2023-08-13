var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Server } = require('http');
const logger = require('../config/winston');

router.post('/register-new', function(req, res) {
  logger.log({
    // Message to be logged
        message: 'New registration: '+ req.body.email + ', ' + req.body.affilliation,
    
    // Level of the message logging
        level: 'info'
  });
  
    add_rego_to_file(req.body.email, req.body.affilliation);
  
    res.send('complete');
});

router.get('/regos-barry', function (req, res) {
  res.send(get_all_regos());
});
  
function add_rego_to_file(email, affiliation) {
  fs.appendFile('registrations.txt',
    'Email: ' + email + ', Affiliation: ' + affiliation + ', Date: ' + new Date() + '', function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
}

function get_all_regos() {
  var regos = fs.readFileSync('registrations.txt', 'utf8');
  return regos;
}


module.exports = router;
