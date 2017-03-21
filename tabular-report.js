'use strict';

module.exports = {
    reporter: function (result) {
        var fs = require('fs');
        var path = require('path');

        var templates = {
            index: '',
            item: '',
            itemHeader: '',
            noItems: '',
            summary: ''
        };

        var numberOfFailures = {
            failures: 0,
            errors: 0,
            warnings: 0
        };

        function init() {
            loadTemplates();
            calculateNumberOfFailures();
            process.stdout.write(renderView());
        }

        function calculateNumberOfFailures() {
            numberOfFailures.failures = result.length;

            result.forEach(function (element) {
                if (isError(element.error.code)) {
                    numberOfFailures.errors += 1;
                } else {
                    numberOfFailures.warnings += 1;
                }
            });
        }

        function isError(errorCode) {
            return errorCode && errorCode[0] === 'E';
        }

        function loadTemplates() {
            var templatePath = path.join(__dirname) + '/templates/';

            for (var template in templates) {
                templates[template] = fs.readFileSync(templatePath + template + '.html').toString();
            }
        }

        function escapeHtml(string) {
            if (!string) {
                return string;
            }

            return ("" + string)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/@/g, '&#64;')
                .replace(/\$/g, '&#36;')
                .replace(/\(/g, '&#40;')
                .replace(/\)/g, '&#41;')
                .replace(/\{/g, '&#123;')
                .replace(/\}/g, '&#125;')
                .replace(/\[/g, '&#91;')
                .replace(/\]/g, '&#93;')
                .replace(/\+/g, '&#43;')
                .replace(/=/g, '&#61;')
                .replace(/`/g, '&#96;')
                .replace(/\,/g, '&#44;')
                .replace(/\!/g, '&#33;')
                .replace(/%/g, '&#37;');
        }

        function prepareContent() {
            var content = '';
            var oldFile = '';

            if (result.length === 0) {
                return templates.noItems;
            }

            var errors = 0;
            var warnings = 0;

            result.forEach(function (element) {
                var file = element.file;
                var error = element.error;

                
                if (oldFile !== file) {
                    if(oldFile != ''){
                        content += templates.itemHeader
                        .replace('{file}', escapeHtml(oldFile))
                        .replace('{warnings}', escapeHtml(warnings))
                        .replace('{errors}', escapeHtml(errors));
                    }
                    oldFile = file;
                    errors = 0;
                    warnings = 0;
                }

                if (isError(element.error.code)) {
                    errors += 1;
                } else {
                    warnings += 1;
                }

                content += templates.item
                    .replace('{class}', isError(error.code) ? 'danger' : 'warning')
                    .replace('{code}', escapeHtml(error.code))
                    .replace('{line}', escapeHtml(error.line))
                    .replace('{type}', isError(error.code) ? 'Error' : 'Warning')
                    .replace('{character}', escapeHtml(error.character))
                    .replace('{evidence}', escapeHtml(error.evidence))
                    .replace('{reason}', escapeHtml(error.reason));
            });

            content += templates.itemHeader
                        .replace('{file}', escapeHtml(oldFile))
                        .replace('{warnings}', escapeHtml(warnings))
                        .replace('{errors}', escapeHtml(errors));
                        
            return content;
        }

        function prepareSummary() {
            if (!numberOfFailures.failures) {
                return '';
            }

            return templates.summary
                .replace('{failures}', escapeHtml(numberOfFailures.failures))
                .replace('{errors}', escapeHtml(numberOfFailures.errors))
                .replace('{warnings}', escapeHtml(numberOfFailures.warnings));
        }

        function renderView() {
            return templates.index
                .replace('{content}', prepareContent())
                .replace('{summary}', prepareSummary());
        }

        init();
    }
};
