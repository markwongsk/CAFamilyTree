/**
 * The build directory's layout is::
 *
 * build/
 * ├── bower_components
 * ├── css
 * ├── images
 * ├── index.html
 * ├── karma.conf.js
 * ├── src
 * └── test
 */

module.exports = function (grunt) {
    // Runs `load-grunt-task` to automatically load NPM Tasks that start with `grunt-`
    // For more information, see the docs: http://firstandthird.github.io/load-grunt-config/
    require("load-grunt-config")(grunt);

    // =======
    // Helpers
    // =======
    var sourceWildcards = [
        "**/*.coffee",
        "**/*.ico",
        "**/*.ts",
        "**/*.js",
        "**/*.css",
        "**/*.less",
        "**/*.sass",
        "**/*.html",
        "**/*.svg"
    ];

    function sourceWildcardsIn(prefix) {
        return sourceWildcards.map( function (wildcard) {
            return (prefix + wildcard);
        });
    }

    function includeTypings(files) {
        return files.concat([
            "bower_components/**/*.d.ts",
            "!bower_components/**/{bower_components,typings}/**",
            "typings/**/*.d.ts"
        ]);
    }


    grunt.initConfig({

        // =================
        // grunt-notify-task
        // =================
        notify: {
            watch: {
                options: {
                    message: "grunt watch complete"
                }
            }
        },


        // ===================
        // grunt-contrib-clean
        // ===================
        clean: {
            build: ["build/"]
        },


        // ==================
        // grunt-contrib-copy
        // ==================
        copy: {
            src: {
                files: [
                    {
                        expand: true,
                        src: "bower_components/**",
                        dest: "build/"
                    },
                    {
                        expand: true,
                        src: "images/**",
                        dest: "build/"
                    },
                    {
                        expand: true,
                        cwd: "src/",
                        src: "index.html",
                        dest: "build/"
                    },
                    {
                        expand: true,
                        src: "src/**/*.html",
                        dest: "build/"
                    }
                ]
            },
        },

        // ==================
        // grunt-contrib-less
        // ==================
        less: {
            src: {
                files: [
                    {
                        expand: true,
                        cwd: "src/",
                        src: ["**/*.less"],
                        dest: "build/css",
                        ext: ".css"
                    }
                ]
            },
        },

        // ========
        // grunt-ts
        // ========
        ts: {
            options: {
                failOnTypeErrors: true,
                fast: "never",
                noImplicitAny: true,
                removeComments: false,
                target: "es5",
                sourceRoot: "/"
            },

            src: {
                options: {
                    declaration: true
                },
                src: includeTypings(["src/**/*.ts"]),
                outDir: "build/src"
            }
        },


        // ===================
        // grunt-contrib-watch
        // ===================
        watch: {
            options: {
                // to use, make sure to add the following snippet before the closing </body> tag:
                //
                //     <script src="//localhost:35729/livereload.js"></script>
                //
                // or use the Chrome extension:
                //
                //     https://github.com/gruntjs/grunt-contrib-watch#using-live-reload-with-the-browser-extension
                //
                // for more information:
                //
                //     https://github.com/gruntjs/grunt-contrib-watch#enabling-live-reload-in-your-html
                livereload: true
            },

            bower: {
                files: "bower.json",
                tasks: ["copy", "wiredep"]
            },

            copy: {
                files: sourceWildcardsIn("src/"),
                tasks: ["copy", "wiredep"]
            },

            less: {
                files: "src/**/*.less",
                tasks: "less:src"
            },

            ts: {
                files: "src/**/*.ts",
                tasks: "ts"
            },

            notify: {
                files: "src/**",
                tasks: "notify:watch"
            }
        },


        // =============
        // grunt-wiredep
        // =============
        wiredep: {
            src: {
                src: ["build/index.html"],
                directory: "build/bower_components",
                dependencies: true
            }
        }
    });

    // ==============
    // Register Tasks
    // ==============
    grunt.registerTask("default", [
        "clean",
        "copy",
        "wiredep",
        "less:src",
        "ts",
        "notify:watch",
        "watch"
    ]);
};
