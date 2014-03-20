/*
 * grunt-sauce-tunnel
 * https://github.com/civitaslearning/grunt-sauce-tunnel
 *
 * Copyright (c) 2013 Dan Harbin
 * Licensed under the MIT license.
 */

'use strict';

(function () {
	var SauceTunnel = require('sauce-tunnel');

	module.exports = function (grunt) {
		function configureLogEvents(tunnel) {
			var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
			methods.forEach(function (method) {
				tunnel.on('log:' + method, function (text) {
					grunt.log[method](text);
				});
				tunnel.on('verbose:' + method, function (text) {
					grunt.verbose[method](text);
				});
			});
		}

		grunt.registerMultiTask('sauce_tunnel', 'Runs the Sauce Labs tunnel', function () {
			// Merge task-specific and/or target-specific options with these defaults.
			var options = this.options({
				username: process.env.SAUCE_USERNAME,
				key: process.env.SAUCE_ACCESS_KEY
			});

			var done = null,
				tunnel = null;

			var finished = function () {
				if (done) {
					done();
					done = null;
				}
			};

			function start(options) {
				if (tunnel) {
					stop();

					if (grunt.task.current.flags.stop) {
						finished();
						return;
					}
				}

				done = grunt.task.current.async();

				tunnel = new SauceTunnel(
					options.username,
					options.key,
					options.identifier,
					true, // tunneled = true
					['-v']
				);

				configureLogEvents(tunnel);

				grunt.log.writeln('Open'.cyan + ' Sauce Labs tunnel: ' + tunnel.identifier.cyan);

				tunnel.start(function (status) {
					if (status === false) {
						grunt.fatal('Failed'.red + ' to open Sauce Labs tunnel: ' + tunnel.identifier.cyan);
					}

					grunt.log.ok('Successfully'.green + ' opened Sauce Labs tunnel: ' + tunnel.identifier.cyan);
					finished();
				});

				tunnel.on('exit', finished);
				tunnel.on('exit', stop);
			}

			function stop() {
				if (tunnel && tunnel.stop) {
					grunt.log.writeln('Stopping'.cyan + 'Sauce Labs tunnel: ' + tunnel.identifier.cyan);
					tunnel.stop(function () {
						grunt.log.writeln('Stopped'.red + 'Sauce Labs tunnel: ' + tunnel.identifier.cyan);
						tunnel = null;
						finished();
					});
				} else {
					finished();
				}
			}

			start(options);
		});
	};
})();