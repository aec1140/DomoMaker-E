const models = require('../models');

const Domo = models.Domo;

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
  if (!req.body.name || !req.body.age || !req.body.strength) {
    return res.status(400).json({ error: 'RAWR! Name, age, strength are required' });
  }
  console.dir(req.body.strength);
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    strength: req.body.strength,
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

    return res.status(400).json({ error: 'An error has occured.' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;
  
  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;
  
  console.dir(req.body);
  
  Domo.DomoModel.remove({_id: req.body.id}, function(err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    } else {
      return res.json({ redirect: '/maker' })
    }
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;