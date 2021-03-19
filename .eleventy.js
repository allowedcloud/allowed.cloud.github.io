const htmlmin = require("html-minifier");
const moment = require('moment');
const typesetPlugin = require('eleventy-plugin-typeset');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

moment.locale('en');

module.exports = function (eleventyConfig) {
  // Passthrough

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
  });
  eleventyConfig.addPassthroughCopy({ "./scripts": "/", });
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL'); // E.g. May 31, 2019
  });
  eleventyConfig.addPassthroughCopy({ "static": "/" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/animate.css/animate.min.css": "assets/animate.min.css"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/hover.css/css/hover-min.css": "assets/hover.css"
  });
  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

  // Plugins

  eleventyConfig.addPlugin(typesetPlugin({
    only: '.exerpt',
  }));

  eleventyConfig.addPlugin(syntaxHighlight);

  // Shortcodes

  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });


  // Other

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      output: 'docs'
    }
  };
};

function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }
 
  let excerpt = null;
  const content = article.templateContent;
 
  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];
 
  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);
 
    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });
 
  return excerpt;
}
