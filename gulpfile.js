const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', copyIcons);
task('build:ai-docs', copyAIDocs);
task('build:all', series(copyIcons, copyAIDocs));
task('default', series('build:all'));

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

function copyAIDocs() {
	// Copy README files
	const readmeSource = path.resolve('nodes', '**', '*.md');
	const readmeDestination = path.resolve('dist', 'nodes');

	src(readmeSource).pipe(dest(readmeDestination));

	// Copy codex files
	const codexSource = path.resolve('nodes', '**', '*.codex.{ts,js}');
	const codexDestination = path.resolve('dist', 'nodes');

	src(codexSource).pipe(dest(codexDestination));

	// Copy AI-specific files
	const aiSource = path.resolve('nodes', '**', 'ai', '**', '*.*');
	const aiDestination = path.resolve('dist', 'nodes');

	src(aiSource).pipe(dest(aiDestination));

	// Copy examples for AI agents
	const examplesSource = path.resolve('nodes', '**', 'examples', '**', '*.*');
	const examplesDestination = path.resolve('dist', 'nodes');

	return src(examplesSource).pipe(dest(examplesDestination));
}
