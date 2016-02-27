module.exports = function(grunt) {

    grunt.initConfig({

        shell: {
            rebuildApi: {
                command: 'sudo sh -c "/opt/elastickube/build/kubegrunt/kube-setup.sh"'
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            api: {
                files: ['../../src/**/Dockerfile-*', './**/*.yaml', './**/*.sh'],
                tasks: ['shell:rebuildApi']
            }
        }

    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['shell', 'watch']);

};
