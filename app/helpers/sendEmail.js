module.exports = (app) => {
    return {
        send: (User, Template, Description) => {
            const nodemailer = require('nodemailer')

            const transporte = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: false, // use SSL 
                auth: {
                    user: 'felipedeluxe@gmail.com',
                    pass: 'jokerboy123@'
                }
            })
            console.log(Template)
            transporte.sendMail({
                from: 'Felipe Amorim <felipedeluxe@gmail.com>',
                to: User.email,
                subject: Description,
                html: Template
            }, (err) => {
                if (err) throw err
            })
        }
    }
}
