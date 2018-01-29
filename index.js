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
  .then((createdId) => {
    console.log('New ID registered: ', createdId.id);
    res.status(200).send('ID Registered')
  })
})

app.get('/:id', function(req, res, next) {
  const attemptId = req.params.id;
  models.Ids.findOne({
    where: {
      rfId: attemptId
    }
  })
  .then(foundModel => {
    if (!foundModel) {
      models.accessAttempts.create({
        rfId: attemptId,
        access: false,
        time: new Date,
      })
      .then(() =>
      res.status(401).send('ID not found, access denied'));
    } else {
      models.accessAttempts.create({
        rfId: attemptId,
        access: true,
        time: new Date
      })
      .then(() =>
      res.status(200).send('ID found, access granted'));
    }
  })
  .catch(next);
})


// app.post('/:id', function(req, res, next) {
//   const idImage = req.body.image;
//   const attemptId = req.params.id;
//   models.Ids.findOne({
//     where: {
//       rfId: attemptId
//     }
//   })
//   .then(foundModel => {
//     if (!foundModel) {
//       models.accessAttempts.create({
//         rfId: attemptId,
//         image: idImage,
//         access: false,
//         time: new Date,
//       })
//       .then(() =>
//       res.status(401).send('ID not found, access denied'));
//     } else {
//       models.accessAttempts.create({
//         rfId: attemptId,
//         image: idImage,
//         access: true,
//         time: new Date
//       })
//       .then(() =>
//       res.status(200).send('ID found, access granted'));
//     }
//   })
//   .catch(next);
// })

app.use('/', function(err, req, res, next) {
  console.error.bind(console, err);
  res.status(err.status || 500).send(err.message);
})
