module.exports = app => {
    const User = require('../models/User')(app)
    const crypto = require('../../helpers/crypto')
    const mongoose = require('mongoose');
    const email = require('../../helpers/sendEmail')(app)
    return {
        create: (req, res) => {
            let doc = new User(req.body);
            doc.pass = crypto.md5(req.body.pass || res.status(500).json({ title: 'password', message: 'empty password' }))
            doc.valid = false;
            //email.send(doc,'<h2>Validar usuário:<h2>'+doc.user+' - senha: '+req.body.pass+' <a href="http://localhost:3200/user/valid/"'+doc._id+'>Confirmar</a>','Confirmação de cadastro')
            doc.save(function (err, r) {
                if (err) res.status(500).json(err)
                res.status(200).json(r)
            });
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        login: (req, res) => {
            let user = new User(req.body)
            user.pass = crypto.md5(req.body.pass || res.status(500).json({ title: 'password', message: 'empty password' }))
            const query = User.find({ user: user.user, pass: user.pass });
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                if (docs.length == 0) return res.status(401).json({ title: 'invalid', message: 'invalid user' })
                res.status(200).json({ title: 'Login', message: 'Success', user: docs })
            });
        },
        find: (req, res) => {
            var query = User.find({});
            query.exec(function (err, docs) {
                if (err) res.status(500).json(err)
                res.status(200).json(docs)
            });
        },
        findOne: (req, res) => {
            var query = User.find({ _id: req.params.id });
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
