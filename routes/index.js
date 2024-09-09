module.exports = app => {
    require('./burger.routes')(app);
    require('./usuarios.routes')(app);
    require('./home.routes')(app);
    require('./local.routes')(app);
    require('./review.routes')(app);
}