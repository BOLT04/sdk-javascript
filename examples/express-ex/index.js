var express = require("express");
var app = express();

const Unmarshaller02 = require("cloudevents-sdk/http/unmarshaller/v02");
var unmarshaller = new Unmarshaller02();

app.use((req, res, next) => {
    var data='';

    req.setEncoding('utf8');
    req.on('data', function(chunk) {
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.post('/', function (req, res) {
  console.log(req.headers);
  console.log(req.body);

  unmarshaller.unmarshall(req.body, req.headers)
    .then(cloudevent => {
      // pretty print
      console.log("Accepted event:");
      console.log(JSON.stringify(cloudevent.format(), null, 2));

      res.status(201)
            .send("Event Accepted");
  })
  .catch(err => {
    console.error(err);
    res.status(400)
          .header("Content-Type", "application/json")
          .send(JSON.stringify(err));
  });

});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
