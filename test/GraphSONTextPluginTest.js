import Plugin from '../src/GraphSONTextPlugin';
import GremlinConsole from 'gremlin-console';

describe('integration', () => {
    it('should add params to console', () => {
        document.body.innerHTML = __html__['test/index.html'];
        const gc = GremlinConsole("#window", "#input");
        const plugin = new Plugin();
        plugin.load(gc);
        gc.initClient();
        gc.client.constructor.name.should.eql('DriverClient');
    });

    it('should allow console to return text', (done) => {
        document.body.innerHTML = __html__['test/index.html'];
        const input = $('#input');
        const window = $('#window');
        const gc = GremlinConsole(window, input);
        const plugin = new Plugin();
        const spy = sinon.spy();

        plugin.load(gc);
        gc.initClient();

        gc.client.constructor.name.should.eql('DriverClient');

        gc.on('results', (query, parser) => {
            spy();
            query.should.eql("5+5");
            expect(parser._rawResults).to.eql([{text:["10"], json: [10]}]);
            assert.isOk(spy.called, "spy wasn't called");
            setTimeout(() => {
                window.html().should.eql('<div class="port-section"><div class="port-query">gremlin&gt; 5+5</div><div class="port-response text">==&gt;<span class="number">10</span><br></div><div class="port-response json" style="display: none;"><span class="number">10</span><br></div></div>');
                //check appending behavior by issuing another result
                done();
            }, 2000);
        });

        input.val("5+5");
        const e = $.Event("keypress");
        e.which = 13;
        input.trigger(e);
    });
});

describe('Client.execute()', () => {

        it('should execute correctly with: query + callback', () => {
            document.body.innerHTML = __html__['test/index.html'];
            const gc = GremlinConsole("#window", "#input");
            const plugin = new Plugin();
            plugin.load(gc);
            gc.initClient();
            gc.client.execute("5+5", () => {});
        });

        it('should execute correctly with: query + bindings + callback', () => {
            document.body.innerHTML = __html__['test/index.html'];
            const gc = GremlinConsole("#window", "#input");
            const plugin = new Plugin();
            plugin.load(gc);
            gc.initClient();
            gc.client.execute("5+variable", {variable:5}, () => {});
        });

        it('callback should receive GraphSONTextParser object', (done) => {
            document.body.innerHTML = __html__['test/index.html'];
            const gc = GremlinConsole("#window", "#input");
            const plugin = new Plugin();
            plugin.load(gc);
            gc.initClient();
            gc.client.execute("5+5", (parser) => {
                parser.constructor.name.should.equal('GraphSONTextParser');
                expect(parser._rawResults).to.eql([{text:["10"], json:[10]}]);
                done();
            });
        });

        it('callback should receive Error', (done) => {
            document.body.innerHTML = __html__['test/index.html'];
            const gc = GremlinConsole("#window", "#input");
            const plugin = new Plugin();
            plugin.load(gc);
            gc.initClient();
            gc.client.execute("5+doesnotexist", (parser) => {
                parser.constructor.name.should.equal('GraphSONTextParser');
                parser._rawError.constructor.name.should.eql('Error');
                parser._rawError.message.replace(/Script[0-9]+/g, "Script").should.eql("No such property: doesnotexist for class: Script (Error 597)");
                expect(parser._rawResults).to.eql(undefined);
                done();
            });
        });

        it('should return the right data with bindings', (done) => {
            document.body.innerHTML = __html__['test/index.html'];
            const gc = GremlinConsole("#window", "#input");
            const plugin = new Plugin();
            plugin.load(gc);
            gc.initClient();
            gc.client.execute("5+variable", {variable:5}, (parser) => {
                expect(parser._rawResults).to.eql([{text:["10"], json:[10]}]);
                done();
            });
        });
    });


