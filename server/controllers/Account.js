// Import models.
const models = require('../models');

const Account = models.Account;

// Create actions.
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  // Create internal parameters so no parameter reassign.
  const request = req;

   // Cast to string to avoid security issues.
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password.' });
    }

    request.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  // Create internal parameters so no parameter reassign.
  const request = req;

  // Cast to string to avoid security issues.
  request.body.username = `${req.body.username}`;
  request.body.pass = `${req.body.pass}`;
  request.body.pass2 = `${req.body.pass2}`;

  if (!request.body.username || !request.body.pass || !request.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required.' });
  }

  if (request.body.pass !== request.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      request.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

// Export actions.
module.exports = {
  loginPage,
  signupPage,
  login,
  logout,
  signup,
};
