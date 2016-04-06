import $ from 'jquery';
import Html from 'gremlin-console/lib/Html';
import Parser from 'gremlin-console/lib/Parser';

/**
 * Handles logic related to results sent back to the console
 * These can be custom crafted to suit different server outputs.
 * Either because of a custom serializer or if a call is made to a server side script.
 * It also allows for a change in the way the elements are displayed in html and how the history entries are generated
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class GraphSONTextParser extends Parser {

    /**
     * Creates a Parser object
     *
     * @param  {Error} err     A potential error from the database.
     * @param  {Mixed} results The server results for a query
     * @return {Parser} A populated Parser object
     */
    create(err, results) {
        return new GraphSONTextParser(err, results);
    }

    /**
     * Get generic results.
     * These results are constructed in a way the console can comprehend them.
     * Extend this if you're receiving non conventional data from the server
     *
     * @return {Mixed} raw server results
     */
    getResults() {
        return this.getRawResults()[0].json;
    }

    /**
     * get the HTML results to put into the window dom element
     * Extend this for custom behavior
     *
     * @return {String|DOM} the element you want to append to the console window
     */
    getHtmlResults() {
        var textResultSet = '';
        this.getRawResults()[0].text.forEach( (entry) => {
            textResultSet += '==>'+Html.jsonSyntaxHighlight(entry) + '<br/>';
        });
        var jsonResultSet = '';
        this.getResults().forEach( (entry) => {
            jsonResultSet += Html.jsonSyntaxHighlight(entry) + '<br/>';
        });
        return $('<div>').append($('<div>').addClass("port-response text").html(textResultSet))
                         .append($('<div>').hide().addClass("port-response json").html(jsonResultSet)).html();
    }

    /**
     * get the HTML error to put into the window dom element
     * Extend this for custom behavior
     *
     * @return {String|DOM} the element you want to append to the console window
     */
    getHtmlError() {
        return $('<div>').addClass("port-error").html('Could not complete query => ' + Html.htmlEncode(this.getError().message))
    }
}

export default GraphSONTextParser;
