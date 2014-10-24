/**
 * Created by careerBox on 2014-10-25.
 */

describe('hello world!', function() {

    beforeEach(function() {
       console.log('beforeEach');
    });

    it('should says hello world!', function() {
        expect('hello world!').toEqual('hello world!');
    });

    afterEach(function() {
        console.log('afterEach');
    });

});