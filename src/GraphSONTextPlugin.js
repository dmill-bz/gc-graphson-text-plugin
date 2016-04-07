import Parser from './GraphSONTextParser';
import highland from 'highland';

/**
 * Client that handles responses from the application/gremlinbin mimeType
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class GraphSONTextPlugin {

    /**
     * This method loads all the required features for this plugin
     *
     * @param  {Console} main the console object
     * @return {Void}
     */
    load(main) {
        main.parser = new Parser();
        const driverOptions = {
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
            }
        };

        main.options.driverOptions = Object.assign(main.options.driverOptions, driverOptions);
    }
}

export default GraphSONTextPlugin;
