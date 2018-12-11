'use strict';
const myHandler = require('./index').handler;
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('myHandler.handler should return with expected statusCodes', () => {

it('should return a 200 statusCode', (done) => {
  try{ 
  myHandler.handler(event, {
    succeed : (data) => {
      expect(data).to.eventually.have.property('statusCode');
      expect(data.statusCode).to.eventually.equal(200);
      done();
    },
    fail : (data) => {
      expect(data).to.have.property('statusCode');
      done();
    },
  });
  } catch(err){
    done(err.message);
  }
});


});