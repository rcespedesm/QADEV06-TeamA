var expect = require('chai').expect;
var request = require('../../lib/RequestManager/manager.js');
var generator = require('../../utils/generator.js');
var dbQuery = require('../../lib/Conditions/dbQuery.js');
var config = require('../../config/config.json');

describe('CRUD: methods for API-Locations', function(){

    this.slow(config.timeSlow);
    this.timeout(config.timeOut);
    var locationId;

    before(function(done){
        request.authentication.postLogin(function(err, res){
            done();
        });
    });

    beforeEach(function(done){
        var randomLocation = generator.generator_location.generateLocation();
        dbQuery.preCondition.insertLocation(randomLocation, function(result){
                locationId = result._id;
                done();
            });
    });

    afterEach(function(done){
        if (locationId !== undefined) {
            dbQuery.removeLocation( locationId, function(){
                done();
            }); 
        }
    });

    it('POST /Locations creates a new location', function(done){
        var randomLocation = generator.generator_location.generateLocation();
        request.location.postLocation(randomLocation, function(err, res){
            var actualResult = res.body;
            dbQuery.assertion.verifyLocationExist(res.body._id, function(result){
                    expect(actualResult.customName).to.equal(result.customName);
                    expect(actualResult.name).to.equal(result.name);
                    expect(actualResult.fontIcon).to.equal(result.fontIcon);
                    done();
                });
        });
    });

    it('GET /Locations/{:Id} returns the location specified', function(done){
        request.location.getLocationById(locationId, function(err, res){
            var actualResult = res.body;
            dbQuery.assertion.verifyLocationExist(res.body._id, function(result){
                    expect(actualResult.customName).to.equal(result.customName);
                    expect(actualResult.name).to.equal(result.name);
                    expect(actualResult.fontIcon).to.equal(result.fontIcon);
                    done();
                });
        }); 
    });

    it('PUT /Locations/{:id} modifies the location specified', function(done){
        var randomLocation = generator.generator_location.generateLocation();
        request.location.putLocation(locationId, randomLocation, function(err, res){
                var actualResult = res.body;
                dbQuery.assertion.verifyLocationExist(res.body._id, function(result){
                        expect(actualResult.customName).to.equal(result.customName);
                        expect(actualResult.name).to.equal(result.name);
                        expect(actualResult.fontIcon).to.equal(result.fontIcon);
                        done();
                });
        }); 
    });

    it('GET /Locations returns all locations', function(done){
        request.location.getLocations(function(err, res){
            var actualResult = res.body.length;
            dbQuery.assertion.verifyAllLocations(function(result){
                    expect(actualResult).to.equal(result.length);
                    done();
                });
        }); 
    });

    it('DELETE /Locations/{:Id} delete the location specified',function(done){
         request.location.delLocation(locationId, function(err,res){
            dbQuery.assertion.verifyLocationExist(res.body._id, function(result){
                    expect(result).to.equal(undefined);
                    done();
                });
        });
    });
});