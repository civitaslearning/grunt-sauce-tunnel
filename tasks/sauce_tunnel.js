/*
 * grunt-sauce-tunnel
 * https://github.com/civitaslearning/grunt-sauce-tunnel
 *
 * Copyright (c) 2013 Dan Harbin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('sauce_tunnel', 'Runs the saucelabs tunnel', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			username: process.env.SAUCE_USERNAME,
			key: process.env.SAUCE_ACCESS_KEY,
			identifier: 'workaround', // *have* to specify an identifier thanks to sauce-tunnel... TODO
			tunnelTimeout: 120
		});

		var SauceTunnel = require('sauce-tunnel');
		var done = null;
		var tunnel = null;

		var finished = function () {
			if (done) {
				done();

				done = null;
			}
		};

		function configureLogEvents(tunnel) {
			var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
			methods.forEach(function (method) {
			tunnel.on('log:'+method, function (text) {
				grunt.log[method](text);
			});
			tunnel.on('verbose:'+method, function (text) {
				grunt.verbose[method](text);
			});
			});
		}

		var plugin = {
			start: function (options) {
				if (tunnel) {
					this.stop();

					if (grunt.task.current.flags.stop) {
						finished();
						return;
					}
				}

				grunt.log.writeln('Starting'.cyan + ' saucelabs tunnel');

				done = grunt.task.current.async();

				tunnel = new SauceTunnel(
					options.username,
					options.key,
					options.identifier,
					true, // tunneled = true
					options.tunnelTimeout
				);
				configureLogEvents(tunnel);

				tunnel.start(function (isCreated) {
					if (!isCreated) {
						// TODO FIXME
					}
					grunt.log.ok("Connected to Saucelabs");
					finished();
				});

				tunnel.on('exit', finished);
				tunnel.on('exit', this.stop);
			},
			stop: function () {
				if (tunnel && tunnel.stop) {
					grunt.log.writeln('Stopping'.red + 'sacuelabs tunnel');
					tunnel.stop(function () {
						tunnel = null;
						grunt.log.writeln('Stopped'.red + 'saucelabs tunnel');
						finished();
					});
				}
				else {
					finished();
				}
			}
		};

		plugin.start(options);
	});

};
