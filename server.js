require('dotenv').load();
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sendgrid  = require('sendgrid')(process.env.SEND_GRID);
var email = new sendgrid.Email();

app.use(bodyParser.json());
app.set('port', 3000);
app.use(express.static(__dirname + '/app'));
app.set('view engine', 'jade');

/* Handle 404
app.use(function(req, res) {
    res.status(404);
    res.redirect('/');
});


// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('500.jade', {title:'500: Internal Server Error', error: error});
});
*/

function thankYouEmail(dest, from, destName) {
    
    var client = dest;
    var me = from;
    var clientName = destName;
    
    email.addTo(client);
    email.setFromName('Alexis Phanor');
    email.setFrom(me);
    email.setSubject('Alexis Phanor - Thank you for your email!');
    email.setText('I will get back to you as soon as possible. Have a lovely day.');
    email.setHtml('<div style="text-align: center; color: #FFF;"><h4>Thank you <span style="color:#FFA500;">'+clientName+'</span>.</h4><p>I will get back to you as soon as possible. Have a lovely day.</p></div>');
    
    email.setFilters({
        'templates': {
            'settings': {
                'enable': 1,
                'template_id' : process.env.TEMPLATE_ID_TY
            }
        }
    });
    
    sendgrid.send(email, function(err, json) {
    if (err) { 
        console.log(json);
        console.log(desti);
        console.log(from);
        console.log(destName);
    }
        console.log(json); 
    });
}

app.post('/email', function(req, res) {
    
    var dest = req.body.from;
    var from = process.env.EMAIL;
    var destName = req.body.nameuh;
    
    
    email.addTo(process.env.EMAIL);
    email.setFromName(req.body.nameuh);
    email.setFrom(req.body.from);
    email.setSubject('AP - Project Planner');
    email.setText(req.body.text);
    email.setHtml('<div style="text-align: center; color: #FFF;"><h4>From: <span style="color:#FFA500;">'+req.body.nameuh+'</span></h4><p>'+req.body.text+'</p></div>');
    
    email.setFilters({
        'templates': {
            'settings': {
                'enable': 1,
                'template_id' : process.env.TEMPLATE_ID
            }
        }
    });

    sendgrid.send(email, function(err, json) {
    if (err) { 
        console.log(json);
        return res.send("Problem Sending Email!");
    }
        console.log(json);     
        res.send("Email Sent OK!");
        setTimeout(function(){
            thankYouEmail(dest, from, destName)
        }, 2000)
    });
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port')  ) ;
});