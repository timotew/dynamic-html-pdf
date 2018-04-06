/**
 * dynamic-handlebar-pdf
 *
 *
 * Copyright (c) 2017 Navjot Dhanawat
 * Licensed under the MIT license.
 */

/**
 * Dynamic handlebars pdf is used to create pdf from handlebar templates.
 * @param  {document, options}
 * @return {callback}
 */

var Handlebars = require('handlebars'),
    pdf = require('html-pdf');

module.exports = {};
module.exports.create = (document, options) => {
    // Compile handlebar template
    return new Promise((resolve, reject) => {

        if (!document || !document.template || !document.context) {
            reject(new Error("Some, or all, options are missing."));
        }

        if (document.type !== 'buffer' && !document.path) {
            reject(new Error("Please provide path parameter to save file or if you want buffer as output give parameter type = 'buffer'"));
        }
        
        Handlebars.registerHelper('math', function(lvalue, operator, rvalue, options) {
           lvalue = parseFloat(lvalue);
           rvalue = parseFloat(rvalue);

           return {
              '+': lvalue + rvalue,
              '-': lvalue - rvalue,
              '*': lvalue * rvalue,
              '/': lvalue / rvalue,
              '%': lvalue % rvalue
            }[operator];
         });

        var html = Handlebars.compile(document.template)(document.context);
        var pdfPromise = pdf.create(html, options);
        if (document.type === 'buffer') {
            // Create PDF from html template generated by handlebars
            //Output will be buffer
            pdfPromise.toBuffer((err, buff) => {
                if (!err)
                    resolve(buff);
                else
                    reject(err);
            });
        } else {
            // Create PDF from html template generated by handlebars
            // Output will be PDF file
            pdfPromise.toFile(document.path, (err, res) => {
                if (!err)
                    resolve(res);
                else
                    reject(err);
            });
        }
    });
};
