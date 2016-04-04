import Result from './GraphSONTextResult';
import BaseClient from 'gremlin-console/lib/DriverClient';
import highland from 'highland';

/**
 * Client that handles responses from the application/gremlinbin mimeType
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class GraphSONTextClient extends BaseClient{

    /**
     * Create the client
     *
     * @param  {String}  host    the host name / ip
     * @param  {Integer} port    the port number for the client to connect to
     * @param  {Object}  options the driver options as per defined in the driver documentation
     * @return void
     */
    constructor(host = "localhost", port = 8182, options = {}) {
        super(host, port, {
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
        });
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
