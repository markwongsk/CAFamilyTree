module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('typescript-tpm');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['js/**/*.js', 'js/**/*.js.map']
            }
        },

        'tpm-install': {
            options: {
                dev: false
            },
            all: {
                src: 'package.json',
                dest: 'lib/typings/'
            }
        },

        typescript: {
            base: {
                src: ['src/**/*.ts', 'src/**/*.d.ts'],
                dest: 'js',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },

        watch: {
            files: 'src/**/*.ts',
            tasks: 'typescript'
        }
    });

    grunt.registerTask('default', [
        'clean',
        'tpm-install',
        'typescript'
    ]);
}
