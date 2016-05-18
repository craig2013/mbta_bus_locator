({
    appDir: "./",
    baseUrl: "./",
    dir: "dist",
    modules: [
        {
            name: "main"
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: "standard",
    removeCombined: true,
    paths: {
        async: "libs/require-js/plugins/async/async",
        markerlabel: "libs/google-maps/markerwithlabel-amd",
        jquery: "libs/jquery/jquery",
        underscore: "libs/underscore/underscore",
        backbone: "libs/backbone/backbone",
        chosen: "libs/jquery/plugins/chosen/chosen",
        text: "text",
        templates: "templates"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        chosen: {
            deps: [ "jquery" ]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        }
    }
});