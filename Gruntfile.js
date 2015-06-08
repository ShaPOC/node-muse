/**
 *  Node Muse
 *
 *  GruntFile used to automate testing
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 1.0.0
 */

'use strict';

// General method used to check the security of the command
var securityMeasures = function(grunt) {

    if(process.env.USER === "root") {
        grunt.fail.fatal("Grunt got scared, don't execute it as root user!");
        return false;
    }
    return true;
};

module.exports = function(grunt) {

    // Config initialisation
    var grunt_config = {};

    // Insert the config
    grunt.initConfig(grunt_config);

    /**
     * -----------------------------------------------------
     *  Insert the Package json configs
     * -----------------------------------------------------
     */

    grunt_config["pkg"] = grunt.file.readJSON('package.json');

    /**
     * -----------------------------------------------------
     *  Code Quality FTW
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt_config["jshint"] = {
        files: ['Gruntfile.js', 'src/**/*.js'],
        options: {
            jshintrc : true
        }
    };

    /**
     * -----------------------------------------------------
     *  Unit tests Jasmine
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-jasmine-node-new');
    grunt_config["jasmine_node"] = {
        options: {
            specNameMatcher: 'test'
        },
        all: ['tests/']
    };

    /**
     * -----------------------------------------------------
     *  Register tasks
     * -----------------------------------------------------
     */

    var run = function() {

        securityMeasures(grunt);
        grunt.task.run(["jshint", "jasmine_node"]);
    };

    // Both are okay
    grunt.task.registerTask('default', 'Perform quality assurance tests.', run);
};
