const Crawler = require("crawler");

exports.getCotas = async (req, res, next) => {

    try {

        const c = new Crawler({ callback: (error, resC, done) => receiveData(res, error, resC, done) });
        c.queue("http://cotasonline.com.br/consorcio-autos-caminhao.asp");

    } catch (error) {
        res.status(200).send({ message: error.message || error });
    }
}

function receiveData(res, error, resC, done) {

    if (error) {

        res.status(500).send({ message: error.message || error });
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
            const obs = $($(tds[4]).find("div")[0]).text();
            const totalObs = formatNotes(obs);
            const link = "http://cotasonline.com.br/" + $($(tds[5]).find("div a")[0]).attr('href');

            const juros = calcTax(credito, entrada, totalParcelas, totalObs);
            const percentual = calcPercentage(credito, entrada + totalParcelas + totalObs);

            data.push({
                credito: credito,
                entrada: entrada,
                parcelas: parcelas,
                totalParcelas: totalParcelas,
                administradora: administradora,
                observacoes: obs,
                totalObservacoes: totalObs,
                link: link,
                juros: juros,
                percentual: percentual
            });

        }

        data.sort((a, b) => {
            if (a.percentual > b.percentual) return 1;

            if (a.percentual < b.percentual) return -1;

            return 0;
        });

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

    val = val.trim();

    val = val.replace(".", "");
    val = val.replace(",", ".");

    const res = val.split(" ");

    let num = Number(res[0] * res[2]);

    if(isNaN(num)) num = 0;

    return num;
}

function calcTax(credito, entrada, parcelas, obs) {
    const tax = Number((entrada + parcelas + obs) - credito);
    return Math.round(tax * 100) / 100;;
}

function calcPercentage(credito, total) {

    const perc = ((total * 100) / credito) - 100;
    return Math.round(perc * 100) / 100;
}