
module.exports = (app) => {
    const jwt = require('jsonwebtoken')
    const User = app.datasource.models.User
    return {
        validate: (req, res, next) => {
            const token = req.headers['x-access-token']
            console.log(req.headers)
            if (token) {
                try {
                    const decoded = jwt.decode(token, app.get('superSecret'))
                    if (decoded.exp <= Date.now() && req.user && decoded) {
                        res.status(400).json({error: 'Access Expired, please sign in again'})
                    } else {
                        const query = {where: {token: {$eq: token}}, include: {all: true}}
                        User.findOne(query)
                            .then((user) => {
                                if (user) {
                                    req.user = {
                                        token: user.dataValues.token,
                                        object: user
                                    }
                                    next()
                                } else {
                                    res.status(401).json({message: 'Error fetching token User.'})
                                }
                            })
                            .catch(() => res.status(401).json({message: 'Error fetching token User.'}))
                    }
                } catch (err) {
                    res.status(401).json({message: 'Error: Your token is invalid'})
                }
            } else {
                res.status(401).json({message: 'Error: Authentication not found'})
            }
        }
    }
}
