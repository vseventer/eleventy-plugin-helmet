"use strict";

var _posthtml = _interopRequireDefault(require("posthtml"));

var _helmet = _interopRequireDefault(require("./helmet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = eleventyConfig => {
  const pipeline = (0, _posthtml.default)().use(_helmet.default);
  eleventyConfig.addTransform('eleventy-plugin-helmet', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const {
        html
      } = await pipeline.process(content);
      return html;
    }

    return content;
  });
};

module.exports.postHtmlPlugin = _helmet.default;
