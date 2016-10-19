module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "never"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",

        "no-unused-vars": [2, {"vars": "local", "args": "after-used"}],
    },
    "globals": {
        "require": true,
        "define": true,
        "jquery": true,
        "underscore": true,
        "_": true,
        "backbone": true,
        "Backbone": true,
        "Q": true,
        "$": true,
        "global": true,
        "console": true,
        "google": true,
        "window": true,
        "document": true,
        "module": true,
        "e": true,
        "setTimeout": true,
        "clearTimeout": true,
        "alert": true,
        "marker": true
    }    
};