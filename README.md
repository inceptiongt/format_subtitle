# Format Subtitle for Youtube auto translate

## Summarize

This is a TypeScript library that helps convert JSON subtitle files to SRT or TXT format, specifically designed for YouTube's auto-translate feature. It provides a simple command-line interface to transform subtitle files, making them compatible with YouTube's subtitle system or generating plain text files. The tool is built using TSDX and supports various module formats including CJS, ESModules, and UMD.

## Command Line Usage

This package provides a command-line interface for converting JSON subtitle files to SRT or TXT format.

### Installation

```bash
npm install -g format-subtitle
```

### Usage

```bash
format-subtitle <input> [output] [options]
```

Where:
- `<input>` is the path to your input JSON subtitle file (required)
- `[output]` is the path where you want to save the converted file (optional)
- `[options]` are additional flags:
  - `-t, --txt`: Output both SRT and TXT formats

If the output path is not provided, the files will be saved in the same directory as the input file, with the same name but with `.srt` and `.txt` extensions.

### Examples

1. Convert to SRT format only (default):
```bash
format-subtitle input.json output.srt
# or
format-subtitle input.json
# This will create input.srt in the same directory as input.json
```

2. Convert to both SRT and TXT formats:
```bash
format-subtitle input.json output -t
# or
format-subtitle input.json -t
# This will create both input.srt and input.txt in the same directory as input.json
```

## 优化

### tStartMs 的计算

```
[{
    "tStartMs": 674460,
    "dDurationMs": 3880,
    "segs": [ {
      "utf8": "他们将首次使用坦克，但\n无济于事。"
    } ]
  }, {
    "tStartMs": 682040,
    "dDurationMs": 3960,
    "segs": [ {
      "utf8": "当罗马尼亚加入协约国时，\n东方的布鲁西洛夫攻势、"
    } ]
  }] 
```
如上述，上一条的 tStartMs + dDurationMs(T1) 不等于下一条的 tStartMs(T2)。

生成新字幕时，上一条正好以句号结尾，生成一条新字幕。这时，新的下一条字幕的 tStartMs 就不应该是 T1，而应该是 T2

# TSDX User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let's get you oriented with what's here and how to use it.

> This TSDX setup is meant for developing libraries (not apps!) that can be published to NPM. If you're looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you're new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).