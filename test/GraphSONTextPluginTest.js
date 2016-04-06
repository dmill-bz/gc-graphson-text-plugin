import Plugin from '../src/GraphSONTextPlugin';
import GremlinConsole from 'gremlin-console';

describe('integration', () => {
    it('should add params to console', () => {
        document.body.innerHTML = __html__['test/index.html'];
        const gc = GremlinConsole("#window", "#input");
        const plugin = new Plugin();
        plugin.load(gc);
        gc.client.constructor.name.should.eql('GraphSONTextClient');
    });

    it('should allow console to return text', (done) => {
        document.body.innerHTML = __html__['test/index.html'];
        const input = $('#input');
        const window = $('#window');
        const gc = GremlinConsole(window, input);
        const plugin = new Plugin();
        const spy = sinon.spy();

        plugin.load(gc);

        gc.client.constructor.name.should.eql('GraphSONTextClient');

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


