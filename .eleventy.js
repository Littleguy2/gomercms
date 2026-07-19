module.exports = function (eleventyConfig) {
  const fs = require("fs");
  const path = require("path");
  const yaml = require("js-yaml");
  const matter = require("gray-matter");

  // Allow .yaml/.yml files as global/front-matter data (Decap CMS writes YAML)
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // Read every .md file in a content/<folder>, parse its front matter + body,
  // and return it as plain data — used for the collections Decap CMS manages
  // (ministries, events, sermons, testimonials, leaders). These files live
  // outside src/, so Eleventy's own template collections can't see them.
  function readContentFolder(folderName) {
    const dir = path.join(__dirname, "content", folderName);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const parsed = matter(raw);
        return {
          data: parsed.data,
          templateContent: parsed.content.trim(),
          slug: f.replace(/\.md$/, ""),
        };
      });
  }

  eleventyConfig.addCollection("ministries", () =>
    readContentFolder("ministries").sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    )
  );
  eleventyConfig.addCollection("events", () =>
    readContentFolder("events").sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    )
  );
  eleventyConfig.addCollection("sermons", () =>
    readContentFolder("sermons").sort(
      (a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0)
    )
  );
  eleventyConfig.addCollection("testimonials", () =>
    readContentFolder("testimonials").sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    )
  );
  eleventyConfig.addCollection("leaders", () =>
    readContentFolder("leaders").sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    )
  );

  // Pass through static assets untouched
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  // Small helper filter used in templates
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  return {
    dir: {
      input: "src",
      includes: "includes",
      data: "../content/data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
