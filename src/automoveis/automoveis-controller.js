const Crawler = require("crawler");

exports.getCotas = async (req, res, next) => {

    try {

        var c = new Crawler({
            maxConnections: 10,
            callback: (error, resC, done) => receiveData(res, error, resC, done)
        });

        c.queue("http://cotasonline.com.br/consorcio-autos-caminhao.asp");


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
        const trs = $(table).find("tr");

        let data = [];

        for (let i = 1; i < trs.length; i++) {

            const tr = trs[i];
            const tds = $(tr).find("td");

            const credito = formarCurrency($($(tds[0]).find("div")[0]).text());
            const entrada = formarCurrency($($(tds[1]).find("div")[0]).text());
            const parcelas = $($(tds[2]).find("div")[0]).text();
            const totalParcelas = formatInstallments(parcelas);
            const administradora = $($(tds[3]).find("div")[0]).text();
            const observacoes = formatNotes($($(tds[4]).find("div")[0]).text());
            const link = "http://cotasonline.com.br/" + $($(tds[5]).find("div a")[0]).attr('href');

            const juros = calcTax(credito, entrada, totalParcelas, observacoes);
            const percentual = calcPercentage(credito, juros);

            data.push({
                credito: credito,
                entrada: entrada,
                parcelas: parcelas,
                totalParcelas: totalParcelas,
                administradora: administradora,
                observacoes: observacoes,
                link: link,
                juros: juros,
                percentual: percentual
            });

        }

        res.status(200).send(data);
    }

    done();
}

function formarCurrency(val) {

    val = val.replace("R$ ", "");
    val = val.replace(".", "");

    return Number(val);
}

function formatInstallments(val) {

    val = val.replace(".", "");
    val = val.replace(",", ".");

    const res = val.split(" ");

    return Number(res[0] * res[2]);
}

function formatNotes(val) {

    if (val == "") {
        return 0;
    }

    val = val.replace(".", "");
    val = val.replace(",", ".");

    const res = val.split(" ");

    return Number(res[0] * res[2]);
}

function calcTax(credito, entrada, parcelas, obs) {
    return Number((entrada + parcelas + obs) - credito);
}

function calcPercentage(credito, juros) {
    return Math.round(Math.abs(((credito * 100) / (credito + juros)) - 100) * 100) / 100;
}