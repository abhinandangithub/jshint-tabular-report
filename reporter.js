'use strict';

module.exports = {
    reporter: function(result){
        var fs = require('fs');
        var path = require('path');

        var templates = {
            body: '',
            item: ''
        };

        var numberOfFailures = {
            failures: 0,
            errors: 0,
            warnings: 0
        };

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

        function init() {
            loadTemplates();
            process.stdout.write(getRenderedHTML());
        }

        function loadTemplates() {
            var templatePath = path.join(__dirname) + '/templates/bootstrap/';

            for (var template in templates) {
                templates[template] = fs.readFileSync(templatePath + template + '.html').toString();
            }
        }

        function prepareContent(){
            var content = '';
            var previousFile = '';

            result.forEach(function(element){
                var file = element.file;
                //content += templates.item.replace('{file}', escapeHtml(file));

                if (previousFile !== file) {
                    previousFile = file;
                    content += templates.item.replace('{file}', escapeHtml(file));
                }

            });

            return content;
        }

        function getRenderedHTML() {
            return templates.body
                .replace('{content}', prepareContent());
        }

        init();
    }
}