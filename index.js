const express = require('express');
const app = express();
const models = require('./models');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())


models.Ids.sync({})
.then(function() {
  return models.accessAttempts.sync({force: true})
})
.then(function() {
  app.listen(3000, () => console.log('App listening on port 3000!'));
})

app.post('/', function(req, res, next) {
  console.log(req.body.rfId)
  const newId = req.body.rfId;
  models.Ids.create({
    rfId: newId
  })
  .then(() => {
    res.status(200).send('ID Registered')
  })
})

app.get('/:id', function(req, res, next) {
  models.Ids.findOne({
    where: {
      rfId: req.params.id
    }
  })
  .then(foundModel => {
    if (!foundModel) {
      res.status(401).send('ID not found, access denied');
    } else {
      res.status(200).send('ID found, access granted');
    }
  })
  .catch(next);
})
