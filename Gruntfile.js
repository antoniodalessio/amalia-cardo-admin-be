module.exports = function(grunt) {

	var baseDir = './src/assets/'
	var bowerDir = "bower_components/";
	var nodeDir = 'node_modules/';
	var destDir = './site/'
		
	var common = [
		bowerDir + 'jquery/dist/jquery.js',
		bowerDir + 'magnific-popup/dist/jquery.magnific-popup.js',
		baseDir + 'js/common.js'
	];


	grunt.initConfig({
		
		compass: {
			dist: {
			options: {
				sassDir: baseDir + 'scss',
				cssDir: baseDir + 'css',
				environment: 'production'
			}
			},
			dev: {
				options: {
					sassDir: baseDir + 'scss',
					cssDir: baseDir + 'css'
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					[destDir + 'js/index.min.js']: common.concat([baseDir + 'js/index.js']),
					[destDir + 'js/about.min.js']: common.concat([baseDir + 'js/about.js']),
					[destDir + 'js/what.min.js']: common.concat([baseDir + 'js/what.js']),
					[destDir + 'js/product.min.js']: common.concat([
						bowerDir + 'jquery-validation/dist/jquery.validate.min.js',
						baseDir + 'js/product.js'
					]),
					[destDir + 'js/fabrics.min.js']: [
						bowerDir + 'jquery/dist/jquery.js',
						nodeDir + 'jquery-zoom/jquery.zoom.js'
					].concat([baseDir + 'js/fabrics.js']),
					[destDir + 'js/work.min.js']: common.concat([baseDir + 'js/work.js']),
					[destDir + 'js/contact.min.js']: common.concat(
						[	bowerDir + 'jquery-validation/dist/jquery.validate.min.js',
							baseDir + 'js/contact.js'
						]),
				}
			}
		},
		webfont: {
			icons: {
				options: {
				stylesheet: 'scss',
				relativeFontPath: '../fonts'
			},
			src: baseDir + 'svg/*.svg',
			dest: baseDir + 'fonts',
			destCss: baseDir + 'scss/'
			}
		},
		watch: {
			css: {
				files: [baseDir + 'scss/**/*.scss'],
				tasks: ['compass'],
				options: {
				spawn: false,
				},
			},
			js: {
				files: [baseDir + 'js/**/*.js'],
				tasks: ['uglify'],
				options: {
				spawn: false,
				},
			},
			webfont: {
				files: [baseDir + 'svg/**/*.svg'],
				tasks: ['webfont'],
				options: {
				spawn: false,
				},
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-webfont');


	grunt.registerTask('default', ['compass', 'uglify', 'webfont', 'watch']);

}