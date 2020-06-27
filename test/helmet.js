// Standard lib.
import { AssertionError } from 'assert';

// Package modules.
import chai, { expect } from 'chai';
import chaiString from 'chai-string';
import postHtml from 'posthtml';

// Local modules.
import postHtmlPlugin from '../helmet';

// Configure.
chai.use(chaiString);

// Helpers.
const postHtmlProcess = async (content) => {
  const { html } = await postHtml().use(postHtmlPlugin).process(content);
  return html;
};

// Tests.
describe('PostHTML plugin', () => {
  it('should move helmet nodes from body', async () => {
    const input = `
      <!doctype html>
      <html>
        <head></head>
        <body>
          <meta name="foo" data-helmet />
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo">
        </head>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `);
  });

  it('should move multiple helmet nodes from body', async () => {
    const input = `
      <!doctype html>
      <html>
        <head></head>
        <body>
          <meta name="foo" data-helmet />
          <meta name="bar" data-helmet />
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo">
          <meta name="bar">
        </head>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `);
  });

  it('should move multiple nested helmet nodes from body', async () => {
    const input = `
      <!doctype html>
      <html>
        <head></head>
        <body>
          <div>
            Hello World.
            <p>
              <meta name="foo" data-helmet />
            </p>
            <meta name="bar" data-helmet />
          </div>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo">
          <meta name="bar">
        </head>
        <body>
          <div>
            Hello World.
            <p></p>
          </div>
        </body>
      </html>
    `);
  });

  it('should not move helmet nodes from head', async () => {
    const input = `
      <!doctype html>
      <html>
        <head>
          <meta name="foo" data-helmet />
        </head>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo" data-helmet="">
        </head>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `);
  });

  it('should move helmet nodes to first head tag', async () => {
    const input = `
      <!doctype html>
      <html>
        <head></head>
        <head></head>
        <body>
          <meta name="foo" data-helmet />
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo">
        </head>
        <head></head>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `);
  });

  it('should fail if no head element is present', async () => {
    const input = `
      <!doctype html>
      <html>
        <body>
          <meta name="foo" data-helmet />
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    try {
      await postHtmlProcess(input);
      throw new Error('Test Failed');
    } catch (e) {
      expect(e).to.be.instanceof(AssertionError);
    }
  });

  it('should not fail if no head element is present but there are no helmet nodes', async () => {
    const input = `
      <!doctype html>
      <html>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <body>
          <p>Not data-helmet</p>
        </body>
      </html>
    `);
  });

  it('should discard duplicate helmet nodes', async () => {
    const input = `
      <!doctype html>
      <html>
        <head>
        </head>
        <body>
          <meta name="foo" data-helmet="foo" />
          <meta name="bar" data-helmet="foo" />
        </body>
      </html>
    `;
    const output = await postHtmlProcess(input);
    expect(output).to.equalIgnoreSpaces(`
      <!doctype html>
      <html>
        <head>
          <meta name="foo">
        </head>
        <body></body>
      </html>
    `);
  });
});
