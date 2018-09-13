// server.js
// Application starts HERE on the servers side
// ...

// initialize dependencies
// Here are the Node.js dependencies 
var express = require('express'); // express is the middleware we use to handle HTTP requests / responses / routing.
var app = express(); // from here on use app.get etc to refer to stuff app does
var exphbs  = require('express-handlebars'); // html templating engine to serve dynamic data
var bodyParser = require('body-parser')
var fs = require('fs'); // library for reading from google sheets to json. Source code here: https://github.com/bassarisse/google-spreadsheet-to-json

var async = require('async');
var crypto = require('crypto');

// import the modules we've created.
var invoices = require('./modules/invoice.js');

// initialize express-handlebars and set the default layout to main.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// // create application/json parser
var jsonParser = bodyParser.json()
// // create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//app.use(bodyParser);
// http://expressjs.com/en/starter/static-files.html
// serves all of the client files in public/*.*
app.use(express.static('public')); 


// Contributor agreement endpoints:
app.get ('/invoices/:notify_url', function (request, response) {
  var notify_url = request.params.notify_url;

  fs.readFile('data/201808-contributor.json', function read (err, data){ 
    if (err) {
        throw err;
      }
     
  var jsonArray = JSON.parse(data);

    //compare the provided notify_url here
  for (x=0; x < jsonArray.length; x++) {
    if (jsonArray[x]['notify_url'] == notify_url) {
      console.log(jsonArray[x]);
      var response_variables = jsonArray[x];
      break
    } 

  }
  if (response_variables == undefined) {
    console.log('Invoice ID: ', notify_url, ' was not found.');
    // Invoice ID not found, render error.
    response.render('contributor-error');
    return
  }

  response.render('contributor-signs', response_variables);
  });
});


// this receives data from the agree button.
app.get ('/invoices/:notify_url/agree', function (request, response) {
  console.log('user agrees: ', request.params.notify_url);

  var notify_url = request.params.notify_url
  var content;

  // There is likely a better way to do this. Maybe sqlite?
  // Currently, it reads an array of JSON objects from a file and then iterates through each invoice, and checks the notify_url param to log agreement.
  // From the discussions I've had, we don't want to use a DB locally but we can if the coop agrees. Sqlite might be a comprimise. - wimm.

  fs.readFile('data/201808-contributor.json', function read(err, data) {
    if (err) {
        throw err;
      }
    content = JSON.parse(data);

    // Invoke the next step here however you like
    //console.log(content);   // Put all of the code here (not the best solution)
    processFile();          // Or put the next step in a function and invoke it
});

  function processFile() {
    for (var i=0; i < content.length; i++) {
      if (content[i]['notify_url'] == notify_url) {
        console.log(content[i]);
        content[i]['contributor_agree'] = 'True'
        content[i]['agree_time'] = Date()
        console.log(content[i]);
        fs.writeFile("data/201808-contributor.json", JSON.stringify(content), function(err) {
        if(err){ 
          console.log('an error occured saving contributor data: ', err)
            }
        //console.log('the file has been written.')
        })
      }
    }
  }

  response.render('contributor-followup');
});


app.get ('/invoices/:notify_url/disagree', function (request, response) {
  console.log('user disagrees ', request.params.notify_url);

  var notify_url = request.params.notify_url
  var content;


  fs.readFile('data/201808-contributor.json', function read(err, data) {
    if (err) {
        throw err;
      }
    content = JSON.parse(data);

    // Invoke the next step here however you like
    //console.log(content);   // Put all of the code here (not the best solution)
    processFile();          // Or put the next step in a function and invoke it
});

  function processFile() {
    for (var i=0; i < content.length; i++) {
      if (content[i]['notify_url'] == notify_url) {
        console.log(content[i]);
        content[i]['contributor_agree'] = 'False'
        content[i]['agree_time'] = Date()
        console.log(content[i]);
        fs.writeFile("data/201808-contributor.json", JSON.stringify(content), function(err) {
        if(err){ 
          console.log('an error occured saving contributor data: ', err)
            }
        //console.log('the file has been written.')
        })
      }
    }
  }

    
  response.render('contributor-followup');
});       

// app.get ('/admin/initiate', function(request, response) {
//   // Read from worksheet, save resulting json to file to record agree/disagrees. 
//   invoices.returnWorksheetJson('1DOwdYxhKIvJuYgQe4xv6-7gZ35bjyNZoQ5uHviFYoaA', 'invoices_summary', function(err, invoice_json) {
//     if (err) { 
//       console.error('an error occured while pulling the contributor data');
//       return;
//     }


//     var invoices_stored_array = []
//     console.log(invoice_json[0].length);
//     // TODO: figure out why invoice_json[0].length doesn't match the length of this months contributors. 
//     for (x=0; x<=54;x++){
//     var invoices_stored_json = {}
//     invoices_stored_json['invoice_pdf_name'] = invoice_json[0][x]['invoice_pdf_name']; 
//     invoices_stored_json['reward_usd'] = invoice_json[0][x]['reward_usd'];
//     invoices_stored_json['eth_hash'] = invoice_json[0][x]['eth_hash'];
//     invoices_stored_json['notify_url'] = invoice_json[0][x]['notify_url'];
//     invoices_stored_json['contributor_agree'] = '';
//     invoices_stored_json['agree_time'] = '';
//     invoices_stored_array.push(invoices_stored_json);
//     }


//     fs.writeFile("data/201808-contributor.json", JSON.stringify(invoices_stored_array), function(err) {
//       if(err){ 
//         console.log('an error occured saving contributor data: ', err)
//       }
//       console.log('the file has been written.')
//     })
//     fs.writeFile("data/backup-201808-contributor.json", JSON.stringify(invoices_stored_array), function(err) {
//       if(err){ 
//         console.log('an error occured saving contributor data: ', err)
//       }
//       console.log('a backup file has been written.')
//     })
//     //console.log(invoices_stored_array);
//     })

//  response.render('contributor-signs')
// });

// listen for requests :)
var listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
