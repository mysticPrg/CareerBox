/**
 * Created by careerBox on 2014-10-25.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["./reports/*"],

        watch: {
            grunt: {
                files: ["Gruntfile.js", "package.json"],
                tasks: "default"
            },
            javascript: {
                files: ["src/**/*.js", "src/*.js", "spec/*Spec.js", "spec/**/*Spec.js"],
                tasks: "test"
            }
        },
        /* jshint -W106 */
        jasmine_node: {
            /* jshint +W106 */
            coverage: {
                savePath: "./reports/coverage/",
                report: ["cobertura"]
            },
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                jUnit: {
                    report: true,
                    savePath: "./reports/jasmine",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['spec/']
        },
        jshint: {
            all: [
                "Gruntfile.js",
                "src/**/*.js",
                "spec/**/*.js"
            ],
            options: {
                jshintrc: ".jshintrc",
                reporter: require('jshint-jenkins-checkstyle-reporter'),
                reporterOutput: 'report-jshint-checkstyle.xml'
            }
        },
        jscpd: {
            javascript: {
                path: "src/**/*.js",
                exclude: ['globalize/**', 'plugins/**'],
                output: "jscpd.xml"
            }
        },

        // for client
        requirejs: {
            compile: {
                options: {
                    name: '../main',
                    out: 'res/app/main.min.js',
                    removeCombined: true,
                    findNestedDependencies: true,
                    baseUrl: 'res/app/js',
                    mainConfigFile: 'res/app/main.js',
                    exclude: [
                        'angular',
                        'angular-route',
                        'angular-bootstrap',
                        'jquery',
                        'jquery-ui',
                        'domReady',
                        'twitter-bootstrap',
                        'kendo',
                        'facebook'
                    ]
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.loadNpmTasks("grunt-jscpd");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.registerTask("test", ["jshint", "jscpd", "jasmine_node"]);
    grunt.registerTask("default", ["test"]);
};