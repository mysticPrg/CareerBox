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
        jasmine: {
            src: ["src/**/*.js", "src/*.js"],
            options: {
                specs: ["spec/*Spec.js", "spec/**/*Spec.js"]
            }
        },
        jshint: {
            all: [
                "Gruntfile.js",
                "src/**/*.js",
                "spec/**/*.js"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("default", ["test"]);
};