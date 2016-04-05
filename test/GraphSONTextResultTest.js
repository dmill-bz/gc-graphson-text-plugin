import Result from '../src/GraphSONTextResult';

describe('GraphSONTextResult', () => {
    describe('.construct()', () => {
        const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
        expect(result._rawError).to.eql({message:"error message"});
        expect(result._rawResults).to.eql([{text:["id=lala"], json: [{id:"lala"}]}]);
    });

    describe('.getRawError()', () => {
        it('should return the proper data', () => {
            const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
            expect(result.getRawError()).to.eql({message:"error message"});
        });
    });

    describe('.getError()', () => {
        it('should return the proper data', () => {
            const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
            expect(result.getError()).to.eql({message:"error message"});
        });
    });

    describe('.getHtmlError()', () => {
        it('should return the error wrapped in a jquery element', () => {
            const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
            const htmlError = result.getHtmlError();
            htmlError[0].constructor.name.should.eql('HTMLDivElement');
            htmlError.attr('class').should.eql('port-error');
            htmlError.html().should.eql('Could not complete query =&gt; error message');
        });
    });

    describe('.getRawResults()', () => {
        it('should return the proper data', () => {
            const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
            expect(result.getRawResults()).to.eql([{text:["id=lala"], json: [{id:"lala"}]}]);
        });
    });

    describe('.getResults()', () => {
        it('should return the proper data', () => {
            const result = new Result({message:"error message"}, [{text:["id=lala"], json: [{id:"lala"}]}]);
            expect(result.getResults()).to.eql([{id:"lala"}]);
        });
    });

    describe('.getHtmlResults()', () => {
        it('should return the error wrapped in a jquery element', () => {
            const result = new Result({message:"error message"}, [{text: ["key=result>"], json: [{"key" : "result>"}]}]);
            const htmlResults = result.getHtmlResults();
            htmlResults.constructor.name.should.eql('String');
            $(htmlResults).eq(0).attr('class').should.eql('port-response text');
            assert($(htmlResults).eq(0).css('display') == "block", "text response should be displayed");
            $(htmlResults).eq(1).attr('class').should.eql('port-response json');
            assert($(htmlResults).eq(1).css('display') == "none", "json response should not be displayed");
            htmlResults.replace(/\n */g,'').should.eql('<div class="port-response text">==&gt;key=result&gt;<br></div><div class="port-response json" style="display: none;">{<span class="key">"key":</span> <span class="string">"result&gt;"</span>}<br></div>');
        });
    });
});
