A little blog utility for organizing posts. It converts nested directories of Markdown files with YAML front matter into a flat directory of aptly-named JSON files—where each file is a post.

Each post is assigned a string ID containing only characters in the regular expression character class `[_a-z0-9-]`—that is, lowercase letters (from 'a' to 'z'), digits ('0' to '9'), dashes ('-') and underscores ('_'). These IDs can be safely included in URLs.

## About

Alpaca was designed for personal use in my blog. I wanted the simplest possible tool for the job, and shell scripts weren't reliable enough, but all existing tools I found felt like overkill. 

I've decided to make the repo public in case it's useful to anyone else. I wrote documentation for the fun of it, really.

## Features

- [x] Generate unique post ID from file hierarchy (i.e. `2024/foo/bar` becomes `2024-foo-bar`)
- [x] Define post date as a pretty human-readable string (i.e. `08/26/2024 8:56AM`)
- [x] Optionally infer post date from file modification date
- [x] Support post-scoped path aliasing for images: `@alpaca/[name].png` resolves to `[alias-path]/[post-id]/[name].png`,

## Command-Line Interface

### `alpaca --help`
```
Usage: alpaca [options] [command]

a little blog utility

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  build [options] [PATH]        compile all posts, build blog
  list|ls [options] [PATH]      list all posts with their IDs
  status|stat [options] [PATH]  show alpaca status
  help [command]                display help for command
```

### `alpaca build --help`
```
Usage: alpaca build [options] [PATH]

compile all posts, build blog

Arguments:
  PATH                             input folder (default: ".")

Options:
  -a, --image-alias <PATH>         how to resolve image path alias
  -q, --quiet                      silence log messages
  -l, --log-file                   create a log file
  -i, --ignore <PATTERN...>        ignore paths matching pattern(s)
  -n, --never-infer-date           never infer post date from file
  -o, --optimize-images            optimize post images when building
  -e, --extensions <EXTENSION...>  image extensions to look for,
                                   comma-separated
  -h, --help                       display help for command
```

### `alpaca list --help`
```
Usage: alpaca list|ls [options] [PATH]

list all posts with their IDs

Arguments:
  PATH                       input folder (default: ".")

Options:
  -i, --ignore <PATTERN...>  ignore paths matching pattern(s)
  -h, --help                 display help for command
```

### `alpaca status --help`
```
Usage: alpaca status|stat [options] [PATH]

show alpaca status

Arguments:
  PATH                       input folder (default: ".")

Options:
  -i, --ignore <PATTERN...>  ignore paths matching pattern(s)
  -h, --help                 display help for command
```
