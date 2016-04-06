import Client from './GraphSONTextClient';
import Parser from './GraphSONTextParser';

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
        //create a custom client
        const client = new Client(main.options.host, main.options.port, main.options.driverOptions, main.parser);
        //change the main's client to the custom one.
        main.client = client;

    }
}

export default GraphSONTextPlugin;
