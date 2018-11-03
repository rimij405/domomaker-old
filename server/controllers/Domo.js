// Import models.
const models = require('../models');

const Domo = models.Domo;

// Create actions.
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Name, age, and favorite food are required.' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    food: req.body.food,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured.' });
  });

  return domoPromise;
};

const deleteDomo = (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({ error: 'RAWR! ID required to delete this domo.' });
  }

  return Domo.DomoModel.findByIdAndDelete(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: `An error occured while deleting Domo ${req.body._id}.`,
      });
    }

    return res.json({ redirect: '/maker' });
  });
};

const getDomos = (req, res) => {
  const request = req;
  const response = res;

  return Domo.DomoModel.findByOwner(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured.' });
    }

    return response.json({ domos: docs });
  });
};

// Export actions.
module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
