import Client from '../src/GraphSONTextClient';

describe('GraphSONTextClient', () => {
    describe('.construct()', () => {
        it('should create a client with default options', () => {
            const client = new Client();

            client.constructor.name.should.equal('GraphSONTextClient');
            should.exist(client.client);
            client.client.constructor.name.should.equal('GremlinClient');

            client.client.port.should.equal(8182);
            client.client.host.should.equal('localhost');
        });

        it('should allow setting the `port` option', () => {
            const client = new Client("localhost", 8183);
            client.client.on('error', (err) => {}); //catch error
            client.client.port.should.equal(8183);
        });

        it('should allow setting the `host` option', () => {
            const client = new Client("otherhost", 8182);
            client.client.on('error', (err) => {}); //catch error
            client.client.host.should.equal('otherhost');
        });

        it('should allow setting the driver options', () => {
            const client = new Client("localhost", 8182, {op:'test'});
            client.client.options.op.should.equal('test');
        });
    });

    describe('.buildResult()', () => {
        it('should create and populate a Result object', () => {
            const client = new Client();
            const result = client.buildResult("raw error", "results");

            result.constructor.name.should.equal('GraphSONTextResult');
            result._rawResults.should.equal('results');
            result._rawError.should.equal('raw error');
        });

        it('should accept a Result object generated from undefined vars', () => {
            const client = new Client();
            const result = client.buildResult(undefined, undefined);

            result.constructor.name.should.equal('GraphSONTextResult');
        });
    });

    describe('.execute()', () => {

        it('should execute correctly with: query + callback', () => {
            const client = new Client();
            client.execute("5+5", () => {});
        });

        it('should execute correctly with: query + bindings + callback', () => {
            const client = new Client();
            client.execute("5+variable", {variable:5}, () => {});
        });

        it('callback should receive Result object', (done) => {
            const client = new Client();
            client.execute("5+5", (result) => {
                result.constructor.name.should.equal('GraphSONTextResult');
                expect(result._rawResults).to.eql([{text:["10"], json:[10]}]);
                done();
            });
        });

        it('callback should receive Error', (done) => {
            const client = new Client();
            client.execute("5+doesnotexist", (result) => {
                result.constructor.name.should.equal('GraphSONTextResult');
                result._rawError.constructor.name.should.eql('Error');
                result._rawError.message.replace(/Script[0-9]+/g, "Script").should.eql("No such property: doesnotexist for class: Script (Error 597)");
                expect(result._rawResults).to.eql(undefined);
                done();
            });
        });

        it('should return the right data with bindings', (done) => {
            const client = new Client();
            client.execute("5+variable", {variable:5}, (result) => {
                expect(result._rawResults).to.eql([{text:["10"], json:[10]}]);
                done();
            });
        });
    });
});
