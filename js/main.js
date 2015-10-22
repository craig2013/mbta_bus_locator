require.config({
	'baseUrl': '/js',
	'paths': {
		'jquery': [
			'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery',
			'libs/jquery-2.1.4'
		],
		'underscore': [
			'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
			'libs/underscore-1.8.3'
		],
		'backbone': [
			'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone',
			'libs/backbone-1.2.1'
		],
		'chosen': [
			'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.jquery',
			'libs/chosen-1.4.2'
		],
		'templates': '../templates'
	},
	'shim': {
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		underscore: {
			exports: '_'
		}
	},
	urlArgs: 'bust='+Date.now()
});

require([
	'underscore',
	'backbone',
	'app'
	],
	function(_, Backbone, app) {
		app.initialize();
});