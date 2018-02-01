exports.urlsDisponiveis = async (req, res, next) => {
    const urls = [
        'http://cotasonline.com.br/',
        'http://www.bolsadascontempladas.com.br/',
        'http://www.cotascontempladas.com.br/',
        'http://www.consorciocontemplado.com.br/',
        'http://www.cartascontempladas.com.br/',
        'http://www.consorciocontempladobh.com.br/',
        'http://globalcotascontempladas.com.br/',
        'http://www.acheiacota.com.br/',
    ];

    res.status(200).send(urls);
}