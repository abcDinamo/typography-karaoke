# Typography Karaoke

A simple prototype showing Karaoke-style cues using HTML5 Audio/Video and WebVTT.

Based on [react-vtt](https://github.com/ChineseCubes/react-vtt) and [Essential React](https://github.com/pheuter/essential-react)

## Getting Started

```sh
$ npm install
```

Start the local dev server:

```sh
$ npm run server
```

Navigate to **http://localhost:8080/** to view the app.

## Commands

A core philosophy of this skeleton app is to keep the tooling to a minimum. For this reason, you can find all the commands in the `scripts` section of [package.json](package.json).

### server

```sh
$ npm run server
```

**Input:** `src/main.jsx`

This leverages [React Hot Loader](https://github.com/gaearon/react-hot-loader) to automatically start a local dev server and refresh file changes on the fly without reloading the page.

It also automatically includes source maps, allowing you to browse code and set breakpoints on the original ES6 code:

### build

```sh
$ npm run build
```

**Input:** `src/main.jsx`

**Output:** `build/app.js`

Build minified app for production using the [production](http://webpack.github.io/docs/cli.html#production-shortcut-p) shortcut.

### test

```sh
$ npm test
```

**Input:** `test/main.js`

**Output:** `coverage/`

Leverages [ava](https://github.com/sindresorhus/ava) to execute the test suite and generate code coverage reports using [nyc](https://github.com/bcoe/nyc)

### coveralls

```sh
$ npm run coveralls
```

**Input:** `coverage/lcov.info`

Sends the code coverage report generated by [nyc](https://github.com/bcoe/nyc) to [Coveralls](http://coveralls.io/).

### clean

```sh
$ npm run clean
```

**Input:** `build/app.js`

Removes the compiled app file from build.

## Converting Video Files

I suggest using ffmpeg with the following command:

```sh
$ ffmpeg -i in.mov -vcodec copy -acodec copy out.mp4
```