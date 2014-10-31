/**
 * Created by careerBox on 2014-10-25.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
                savePath: "./reports/coverage/"
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
        }

});
    grunt.loadNpmTasks('grunt-jscpd');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.registerTask("test", ["jshint", "jscpd", "jasmine_node"]);
    grunt.registerTask("default", ["test"]);
};