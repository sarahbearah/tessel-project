const Sequelize = require('Sequelize');
const db = new Sequelize('postgres://localhost:5432/tessel', {
  logging: false
});

const Ids = db.define('ids', {
  rfId: {
    type: Sequelize.STRING
  },
})

const accessAttempts = db.define('Attempts', {
  rfId: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.BLOB,
  },
  access: {
    type: Sequelize.BOOLEAN,
  },
  time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

module.exports = {
  db,
  Ids,
  accessAttempts
}
