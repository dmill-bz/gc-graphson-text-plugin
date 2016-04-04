import Client from './GraphSONTextClient';

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
        //create a custom client
        const client = new Client(main.options.port, main.options.host, main.options.driverOptions);
        //change the main's client to the custom one.
        main.client = client;
    }
}

export default GraphSONTextPlugin;
