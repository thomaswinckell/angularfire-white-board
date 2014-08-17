module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist", '.tmp'],

        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: ['**', '!app/**', '**/*.html', '!lib/**', '!**/*.css'],
                dest: 'dist/'
            },
            lib: {
                expand: true,
                cwd: 'src/lib/',
                src: ['firebase/*', '**/*.min.js', '**/*.min.css', 'bootstrap/fonts/*'],
                dest: 'dist/lib/'
            }
        },

        rev: {
            files: {
                src: ['dist/**/*.{js,css}']
            }
        },

        useminPrepare: {
            html: 'src/index.html'
        },

        usemin: {
            html: ['dist/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('build', [
        'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin'
    ]);
};