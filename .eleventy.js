module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // Add filters
  eleventyConfig.addFilter("emojiFromCodepoints", function(codepoints) {
    if (!codepoints) return '';
    return codepoints
      .split(' ')
      .map(code => String.fromCodePoint(parseInt(code, 16)))
      .join('');
  });

  eleventyConfig.addFilter("slugify", function(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  });

  eleventyConfig.addFilter("groupBy", function(collection, property) {
    const grouped = {};
    collection.forEach(item => {
      const key = item[property];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
