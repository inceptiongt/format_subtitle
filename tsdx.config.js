module.exports = {
  rollup(config, options) {
    if (options.format === 'cjs' || options.format === 'esm') {
      config.input = {
        index: 'src/index.ts',
        cli: 'src/cli.ts'
      };
      config.output = {
        ...config.output,
        dir: 'dist',
        format: options.format,
        exports: 'named'
      };
    }
    return config;
  },
}; 