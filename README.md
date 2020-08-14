# eleventy-plugin-helmet
> A document head manager for Eleventy.

This [Eleventy](https://www.11ty.dev/) plugin will manage any elements you want to append to the document head.

In your templates, annotate any HTML tag inside the body with a `data-helmet` attribute, and it will be outputted in the document head.

## Features
* Supports any tag located in `body`.
* Supports passing a unique indentifier to the `data-helmet` attribute to avoid tag duplication (see [Example](#Example) below).

## Example
Assume variable `home` is set to `true` for the homepage (`index.html`), and `false` otherwise.

`layout.njk`:
```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/main.css" />
  </head>
  <body>
    {% if home %}
      {% include "home.njk" %}
    {% else %}
      {% include "not-home.njk" %}
    {% endif %}
    <link rel="stylesheet" href="/page.css" data-helmet="page-css" />
  </body>
</html>
```

`home.njk`:
```html
<h1>Title</h1>
<p>Hello World!</p>
<link rel="stylesheet" href="/home.css" data-helmet="page-css" />
<title data-helmet>Title</title>
<meta name="description" content="Hello World!" data-helmet />
```

`not-home.njk`
```html
<h1>Some Page</h1>
<p>Some Page Content!</p>
<title data-helmet>Some Page</title>
<meta name="description" content="Some Page Content!" data-helmet />
```

outputs:

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/main.css" />
    <link rel="stylesheet" href="/home.css" />
    <title>Title</title>
    <meta name="description" content="Hello World!" />
  </head>
  <body>
    <h1>Title</h1>
    <p>Hello World!</p>
  </body>
</html>
```

`not-home.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/main.css" />
    <title>Some Page</title>
    <meta name="description" content="Some Page Content!" />
    <link rel="stylesheet" href="/page.css" />
  </head>
  <body>
    <h1>Some Page</h1>
    <p>Some Page Content!</p>
  </body>
</html>
```

## Installation
`$ npm install --save eleventy-plugin-helmet`

In your `.eleventy.js` file, [register the plugin](https://www.11ty.dev/docs/plugins/):
```js
const eleventyHelmetPlugin = require('eleventy-plugin-helmet');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyHelmetPlugin);
};
```

## Advanced: Using Helmet with an Existing PostHTML Pipeline
If you happen to have existing [Eleventy transforms](https://www.11ty.dev/docs/config/#transforms) leveraging PostHTML, you can hook this plugin into the pipeline like so:

```js
const { postHtmlPlugin: eleventyHelmetPlugin } = require('eleventy-plugin-helmet');

module.exports = (eleventyConfig) => {
  const pipeline = postHtml()
    .use(...) // Your other PostHTML plugins.
    .use(eleventyHelmetPlugin);
  eleventyConfig.addTransform('postHtml', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const { html } = await pipeline.process(content);
      return html;
    }
    return content;
  });
}
```

## Use Cases
This plugin promotes structuring your templates independent from each other - your layout template no longer has to be responsible to e.g. add stylesheets only if a certain child template is loaded. Instead, add a Helmet tag to the child template directly, and the stylesheet will only be embedded when it is really needed.

Other use cases include:
* [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) tags.
* [Resource Hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content).

## Compatibility
Internally, this plugin uses an async [PostHTML](https://posthtml.org/) pipeline, and therefore requires **Eleventy >= 0.7**.

## Changelog
See the [CHANGELOG](./CHANGELOG.md) for a list of changes.

## License
    The MIT License (MIT)

    Copyright (c) 2020 Mark van Seventer

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
