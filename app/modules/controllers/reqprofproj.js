module.exports = app => {
    const mongoose = require('mongoose');
    const ReqProfProj = require('../models/ReqProfProj')(app)
    return {
        create: (req, res) => {
            let doc = new ReqProfProj(req.body);
            doc.save(function (err, r) {
                if (err) res.status(500).json(err)
                res.status(200).json(r)
            });
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        findOne: (req, res) => {
            const query = req.params
            ReqProfProj.findOne(query, res)
        },
        find: (req, res) => {
            var query = ReqProfProj.find({});
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                res.status(200).json(docs)
            });
        },
        contains: (req, res) => {

            var query = ReqProfProj.find({
                $or: [
                    {
                        "categoria": {
                            "$regex": req.params.input, "$options": "i"
                        }
                    },
                    {
                        "especificacoes": { 
                            $elemMatch: { 
                                "$regex": req.params.input, "$options": "i"
                            } 
                        }
                    },
                ]
            });
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                res.status(200).json(docs)
            });
        },
        delete: (req, res) => {
            const query = req.params
            ReqProfProj.delete(query, res)
        }
    }
}
