'use strict';

var expect = require('chai').expect;

var myLambda = require('../index');

describe('myLambda', function () {

    [
        "B07HH9P7B9",
        "B07HH9P7B9"

    ].forEach(function (productId) {

        it(`successful invocation: id=${productId}`, function (done) {

            var context = {

                succeed: function (result) {

                    expect(result).to.be.an('object');
                    expect(result.merchant).to.equal('AMAZON');
                    expect(result.statusCode).to.equal(200);
                    done();
                },

                fail: function () {

                    done(new Error('never context.fail'));
                }
            }

            myLambda.handler({ productId: productId }, { /* context */ }, (err, result) => {

                try {

                    expect(err).to.not.exist;

                    expect(result).to.exist;
                    expect(result).to.be.an('object');

                    done();
                }
                catch (error) {

                    done(error);
                }
            });
        });
    });
});

