# grunt-sauce-tunnel

> Runs and stops the saucelabs tunnel

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sauce-tunnel --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sauce-tunnel');
```

## The "sauce_tunnel" task

### Overview
In your project's Gruntfile, add a section named `sauce_tunnel` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sauce_tunnel: {
    options: {
    	username: 'your sauce username',
    	key: 'your sauce key',
    	identifier: 'tunnel identifier',
    	tunnelTimeout: 120 // whatever timeout you want to use
    },
    server: {}
  },
})
```

### Options

#### options.username
Type: `String`
Default value: `process.env.SAUCE_USERNAME`

Your Saucelabs username

#### options.key
Type: `String`
Default value: `process.env.SAUCE_ACCESS_KEY`

Your Saucelabs key

#### options.identifier
Type: `String`
Default value: `workaround`

See [the FAQ](https://saucelabs.com/docs/connect#tunnel-identifier) for a better explanation. If you use this option, you also have to add the `tunnel-identifier` to your desired capabilities so that Sauce can associate your tests with the tunnel.  Right now it's required by [sauce-tunnel](https://github.com/jmreidy/sauce-tunnel), so it'll default to 'workaround' until `sauce-tunnel` doesn't require it either.

#### options.tunnelTimeout
Type: `Number`
Default value: 120

A numeric value indicating the time to wait before closing all tunnels.


## The "sauce_tunnel\_stop" task

### Overview
In your project's Gruntfile, add a section named `sauce_tunnel_stop` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sauce_tunnel_stop: {
    options: {
        username: 'your sauce username',
        key: 'your sauce key',
        identifier: 'tunnel identifier'
    },
    server: {}
  },
})
```

If stop task is executed after the run task, it's close tunnel on sauce lab server and kill local process. If stop task is executed alone, it's only clause tunnel on sauce lab server.

### Options

#### options.username
Type: `String`
Default value: `process.env.SAUCE_USERNAME`

Your Saucelabs username

#### options.key
Type: `String`
Default value: `process.env.SAUCE_ACCESS_KEY`

Your Saucelabs key

#### options.identifier
Type: `String`
Default value: `workaround`
