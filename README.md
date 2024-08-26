A little blog utility for organizing posts. It converts nested directories of markdown files with front matter into a flat directory of aptly-named JSON files.

## Features

- [x] Generate unique post ID from file hierarchy (i.e. `2024/a/b/c/` becomes `2024-a-b-c`)
- [x] Define post date as a pretty human-readable string (i.e. `08/26/2024 8:56AM`)
- [x] Optionally infer post date from file modification date
- [x] Supports a path alias for images: `@kestrel/[name].png`

## Command-Line Interface

### `kestrel --help`

### `kestrel build --help`

### `kestrel list --help`

### `kestrel status --help`
