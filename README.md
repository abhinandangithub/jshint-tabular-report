*********************
jshint-tabular-report
*********************

Simple generator of tabular HTML report for JSHint results.

## Installation

bash
npm install jshint-tabular-report --save

## Usage

Use it with:

#### JSHint CLI

bash
# standard output
$: jshint reporter node_modules/jshint-tabular-report/tabular-report.js file.js
$: jshint reporter node_modules/jshint-tabular-report/tabular-report.js controllers/*.js

# redirect output to HTML file
$: jshint reporter node_modules/jshint-tabular-report/tabular-report.js file.js > report.html
$: jshint reporter node_modules/jshint-tabular-report/tabular-report.js controllers/*.js > report.html
```

#### [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)

js
grunt.initConfig({
    jshint: {
        options: {
            reporter: require('jshint-tabular-report'),
            reporterOutput: 'jshint-tabular-report.html'
        },
        target: ['file.js']
    }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['jshint']);
```

## URLs

* [jshint-tabular-report on npmjs](https://www.npmjs.com/package/jshint-tabular-report)
* [jshint-tabular-report on github](https://github.com/abhinandangithub/jshint-tabular-report)
								   
## Author

Abhinandan GP
abhinandangp.pes29@gmail.com