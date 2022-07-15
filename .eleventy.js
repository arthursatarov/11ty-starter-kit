const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {

  eleventyConfig.addWatchTarget('src/assets/styles/**/*.css');
  eleventyConfig.addWatchTarget('src/assets/scripts/**/*.js');
  eleventyConfig.addWatchTarget('src/assets/fonts/**/*.{ttf,eof,woff,woff2}');
  eleventyConfig.addWatchTarget('src/assets/images/**/*.{jpg,png,svg,gif,webp}');

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md'],
  };
};
