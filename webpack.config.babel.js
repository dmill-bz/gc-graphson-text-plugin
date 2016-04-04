const config = {
  output: {
    library: 'GCGraphSONTextPlugin',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
}

export default config;
