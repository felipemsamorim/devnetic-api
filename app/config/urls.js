module.exports = {
    database: 'atlante_dev',
    username: 'root',
    password: '',
    params: {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            maxIdleTime: 30
        },
        define: {
            underscored: true
        }
    },
    url: '/api'
}
