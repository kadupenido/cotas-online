const Crawler = require("crawler");

exports.getCotas = async (req, res, next) => {

    try {

        var c = new Crawler({
            maxConnections: 10,
            callback: (error, resC, done) => receiveData(res, error, resC, done)
        });

        c.queue('http://cotasonline.com.br/consorcio-autos-caminhao.asp');


    } catch (error) {
        res.status(200).send({
            success: false,
            message: error.message || error
        });
    }

}

function receiveData(res, error, resC, done) {

    if (error) {

        res.status(500).send({
            success: false,
            message: error.message || error
        });

    } else {

        const $ = resC.$;

        const table = $("table")[0];
        const trs = ta

        res.status(200).send($("title").text());
    }

    done();
}