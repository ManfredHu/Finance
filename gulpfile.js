/*
 * name: gulpfile
 * exp: npm install gulp --save-dev
 */
// 载入外挂
var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	htmlmin = require('gulp-htmlmin'),      //html压缩
	cleanCss = require('gulp-clean-css'),   //css压缩
	jshint = require('gulp-jshint'),        //js检查
	uglify = require('gulp-uglify'),        //js压缩
	useref = require('gulp-useref'),
	runSequence = require('run-sequence'),
	del = require('del');
var putFolder = 'dist'; // 发布目录
var paths = {
	js: 'assets/js',
	css: 'assets/css',
	img: 'assets/img',
	rev: 'assets/rev',
	jshint: [
		'assets/js/**/*.js',
		'!assets/js/lib/**/*.js'
	]
};

// 清空文件
gulp.task('clean', function () {
	return del(putFolder + '/**/*');
});
// js代码规范检查
gulp.task('jshint', function () {
	return gulp.src(paths.jshint)
	.pipe(jshint())
	.pipe(jshint.reporter());
});
gulp.task('files', function () {
	return gulp.src('assets/img/**/*')
	.pipe(gulp.dest(putFolder + '/assets/img'));
});
// 替换为优化过的版本
gulp.task('useref', function () {
	return gulp.src(['./**/*.html', '!./bower_components/**/**', '!./node_modules/**/**'])
	.pipe(useref())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', cleanCss({
		rebase: false,
		advanced: false,
		keepBreaks: true,
		keepSpecialComments: '*'
	})))
	.pipe(gulpif('*.html', htmlmin({
		removeComments: true,
		collapseWhitespace: true,
		collapseBooleanAttributes: false,
		removeEmptyAttributes: false,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	})))
	.pipe(gulp.dest(putFolder));
});

// 代码规范检查
gulp.task('default', function () {
	return runSequence('jshint');
});

gulp.task('build', function () {
	return runSequence('clean', 'useref', 'files');
});