const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController")

/* GET home page. */
router.get('/', indexController.index);

router.get('/sign-up', indexController.signup_get);
// provide sign-up route purely for authentication later with username/password
router.post('/sign-up', indexController.signup_post);

module.exports = router;
