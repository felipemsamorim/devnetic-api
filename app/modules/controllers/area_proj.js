module.exports = app => {
    const mongoose = require('mongoose');
    const AreaProj = require('../models/AreaProj')(app)
    return {
        create: (req, res) => {
            let doc = new AreaProj(req.body);
            doc.save(function (err, r) {
                if (err) res.status(500).json(err)
                res.status(200).json(r)
            });
        },
        update: (req, res) => {
            AreaProj.update({_id: req.params.id}, req.body, {upsert: true}, function(err, doc){
                if (err) res.status(500).json(err)
                res.status(200).json(doc)
            });
        },
        
        find: (req, res) => {
            var query = AreaProj.find({});
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                res.status(200).json(docs)
            });
        },
        get: (req, res) => {
            var query = AreaProj.find({_id:req.params.id});
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                res.status(200).json(docs)
            });
        },
        delete: (req, res) => {
            const query = req.params
            User.delete(query, res)
        }
    }
}
