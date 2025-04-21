module.exports = {
  rollup(config, options) {
    // if (options.format === 'cjs' || options.format === 'esm') {
      config.input = {
        index: 'src/index.ts',
        cli: 'src/cli.ts'
      };
      config.output.dir = 'dist';
      config.output.file = null
    // }
    // console.log('config', config)
    return config;
  },
}; 