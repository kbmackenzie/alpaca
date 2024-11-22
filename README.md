Alpaca is little blog organization utility. It can...

- [x] Convert nested directories of Markdown files with front matter into a **flat** directory of uniquely-named JSON files.
- [x] Generate unique post IDs from file hierarchy (i.e. `foo/bar/baz` becomes `foo-bar-baz`), which can be safely used in URLs.
- [x] Compress all images into web-optimized JPEGs.
- [x] Support post-scoped path prefix alias for image paths (`@alpaca`).
- [x] Transform Markdown, resolving image paths according to config.
- [x] Parse post date from a pretty, human-readable string (i.e. `08/26/2024 8:56AM`).
- [x] Optionally infer post date from file modification date.

Alpaca was designed for personal use. I've made it public just in case it's useful to anyone else, and I wrote documentation for the fun of it. 🦙

## Usage

All documentation can be found [here](docs/alpaca.md).

1. [Introduction](docs/alpaca.md#introduction)
2. [Writing a Post](docs/alpaca.md#writing-a-post)
3. [Configuring Alpaca](docs/alpaca.md#configuring-alpaca)
4. [Command-Line Interface](docs/alpaca.md#command-line-interface)
