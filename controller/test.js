const json_data = require('../http_request_test/out.json')

module.exports = {
    out: function (req, res) {
        let r = json_data.resust;
        let initenaires = []
        let initenaire = []

        r.forEach((e, idx) => {
            let duration_since_last = (idx === 0) ? null : Math.round((e._source.created_date - r[idx - 1]._source.created_date) / 60000)

            let elem = {
                id: e._source.id,
                created_date: new Date(e._source.created_date),
                position: e._source.position,
                duration_since_last: duration_since_last,
            }

            if (duration_since_last === null || duration_since_last < 10) {
                initenaire.push(elem)
            } else {
                initenaires.push(initenaire);
                initenaire = [elem]
            }
        })

        res.status(200).send({initenaires});
    }
}