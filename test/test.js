const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');
chai.use(chaiHttp);

describe('Probando API REST con Mocha - Chai', function () {
    it('Probando GET - La data debe contener una propiedad llamada 1 y esta debe ser un objeto', function (done) {
        chai
            .request(app)
            .get('/')
            .end(function (err, res) {
                let data = JSON.parse(res.text);
                chai.expect(data).to.have.property('1');
                chai.expect(data['1']).to.be.an('object');
                done();
            });
    });
});