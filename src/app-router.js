const express = require('express');
const router = express.Router();
const cotasController = require('./cotas-controller')

router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "COTAS ONLINE API",
        version: "1.0.0"
    });
});

router.get('/urls', cotasController.urlsDisponiveis);

module.exports = router;
