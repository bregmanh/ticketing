module.exports = {
  // watch for changes every 300ms to help see changes reflected when running in docker
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300
    return config;
  },
}
