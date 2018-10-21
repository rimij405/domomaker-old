// Import models.
const models = require('../models');

const Account = models.Account;

// Create actions.
const loginPage = (req, res) => {
    res.render('login');
};

const signupPage = (req, res) => {
    res.render('signup');
};

const logout = (req, res) => {
    res.redirect('/');
};

const login = (req, res) => {

};

const signup = (req, res) => {

};

// Export actions.
module.exports = {
    loginPage,
    signupPage,
    login,
    logout,
    signup
};