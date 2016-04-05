gc-graphson-text-plugin is a [gremlin-console](https://github.com/PommeVerte/gremlin-console-js) plugin that displays text output instead of json. This makes the console ressemble the TinkerPop gremlin console.

[![Build Status](https://travis-ci.org/PommeVerte/gc-graphson-text-plugin.svg?branch=master)](https://travis-ci.org/PommeVerte/gc-graphson-text-plugin) [![Coverage Status](https://coveralls.io/repos/github/PommeVerte/gc-graphson-text-plugin/badge.svg?branch=master)](https://coveralls.io/github/PommeVerte/gc-graphson-text-plugin?branch=master) [![npm](https://img.shields.io/npm/v/gc-graphson-text-plugin.svg)]() [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/PommeVerte/gc-graphson-text-plugin/master/LICENSE.txt) 

## Preview
![Screen Shot](http://pommeverte.github.io/images/screenshot-console.png)
 
## Install
```
npm install gc-graphson-text-plugin
```
You will also need to add [this jar](http://pommeverte.github.io/bin/gremlinbin-plugin-1.0-SNAPSHOT.jar) to your Gremlin server path. Do this by adding the file in `<gremlin-server-home>/ext/gremlinbin-plugin/plugin/`. Then load it by adding the following to your `gremlin-server.yaml` configuration file :
```yaml
# ...
plugins:
  - dmill.gremlinbin
# ...
serializers:
  - { className: com.dmill.GBPlugin.serializers.ConsoleAndGraphSONMessageSerializerV1d0, config: { useMapperFromGraph: graph }}       # application/gremlinbin
```
## Getting started

##### Using ES2015/2016
```javascript
import GremlinConsole from 'gremlin-console';
import GCGraphSONTextPlugin from 'gc-graphson-text-plugin';

//create a console + input combo by passing css selectors to GremlinConsole
const gc = GremlinConsole('#console-window', '#console-input');
gc.register(GCGraphSONTextPlugin()); //register the plugin
```

##### In browser
It is **not** recomended that you do this as this is relatively heavy. `gremlin-console` and `gc-graphson-text-plugin` will contain duplicate dependencies (though they shouldn't conflict). However it is a possible use case.
```html
<head>
  <!-- ... -->
  <link rel="stylesheet" type="text/css" href="umd/css/default.css">
  <script src="path-to-umd/gremlin-console.min.js"></script>
  <script src="path-to-umd/gc-graphson-text-plugin.min.js"></script>
</head>
```
```javascript
//create a console + input combo by passing css selectors to GremlinConsole
var gc = GremlinConsole.create('#console-window', '#console-input');
gc.register(GCGraphSONTextPlugin.init()); //register the plugin
```

## Switching between text and JSON
It is possible to switch between the two outputs manualy. The plugin will actually include the JSON response in the console with it's visibility toggled off. For example :
```html
<div id="window">
   <div class="port-section">
      <div class="port-query">g.V().limit(1).valueMap()<div>
      <div class="port-response text"><!-- text/console output here --><div>
      <div class="port-response json" style="display:none;"><!-- hidden graphSON/JSON output here --><div>
   </div>
</div>
```
You can simply hide/show whichever output you desire. In jQuery this could look like :
```jquery
$("#window .port-response.text").hide();
$("#window .port-response.json").show();
```
