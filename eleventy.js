// Standard lib.
import postHtml from 'posthtml';

// Local modules.
import helmetPlugin from './helmet';

// Exports.
module.exports = (eleventyConfig) => {
  // Initialize PostHTML pipeline.
  const pipeline = postHtml().use(helmetPlugin);

  // Add transform.
  // @see https://www.11ty.dev/docs/config/#transforms
  eleventyConfig.addTransform(
    'eleventy-plugin-helmet',
    async (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const { html } = await pipeline.process(content);
        return html;
      }
      return content;
    }
  );
};

// Export PostHTML plugin separately to allow hooking into existing pipeline.
module.exports.postHtmlPlugin = helmetPlugin;
