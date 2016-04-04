import $ from 'jquery';
import Result from './GraphSONTextResult';
let highland = require('highland');

/**
 * Client that handles responses from the application/gremlinbin mimeType
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class GraphSONTextClient{
    /**
     * @var {GremlinClient} see jbmusso/gremlin-javascript
     */
    client;

    /**
     * Create the client
     *
     * @param  {String}  host    the host name / ip
     * @param  {Integer} port    the port number for the client to connect to
     * @param  {Object}  options the driver options as per defined in the driver documentation
     * @return void
     */
    constructor(host = "localhost", port = 8182, options = {}) {
        const customOptions = {
            accept: "application/gremlinbin",
            executeHandler: (stream, callback) => {
                    let errored = false;
                    let objectMode = false;
                    let returnValue = [{json:[], text:[]}];

                    highland(stream)
                    .stopOnError((err) => {
                      // TODO: this does not seem to halt the stream properly, and make
                      // the callback being fired twice. We need to get rid of the ugly
                      // errored variable check.
                      errored = true;
                      callback(err);
                    })
                    .map(({ result: { data } }) => {
                      objectMode = !_.isArray(data);

                      return data;
                    })
                    .sequence()
                    .toArray((results) => {
                      if (!errored) {
                        let returnCurrent = objectMode ? results[0] : results;
                        if(returnCurrent.length >= 1 && typeof returnCurrent[0].json != "undefined") {
                            returnCurrent.forEach((item) => {
                                returnValue[0].json = returnValue[0].json.concat(item.json);
                                returnValue[0].text = returnValue[0].text.concat(item.text);
                            });
                        } else {
                            returnValue = returnCurrent;
                        }
                        callback(null, returnValue);
                      }
                    });
                },
            ...options
        };
        this.client = GremlinDriver.createClient(host, port, customOptions);
    }

    /**
     * Run a query with various params.
     * Bellow are the three expected params. optionals can be ommitted and interchanged
     *
     * @param  {String}   query    mandatory: the gremlin query to run
     * @param  {Object}   bindings optional: the bindings associated to this query
     * @param  {Function} callback optional: function that executes once the results are received.
     * @return {Void}
     */
    execute(query, bindings, callback) {
        if(typeof bindings === 'function') {
            callback = bindings;
            bindings = undefined;
        }

        //customize the callback params to use Result
        const customCallback = (err, results) => {
            callback(this.buildResult(err, results));
        };
        this.client.execute(query, bindings, customCallback);
    }

    /**
     * Build a result
     *
     * @param  {Object} Error from the driver.
     * @param  {String} results a response result string
     * @return {Result} a result object
     */
    buildResult(err, results) {
        return new Result(err, results);
    }
}

export default GraphSONTextClient;
