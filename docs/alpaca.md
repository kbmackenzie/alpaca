## Table of Contents

1. [Introduction](#introduction)
2. [Writing a Post](#writing-a-post)
3. [Configuring Alpaca](#configuring-alpaca)
4. [Command-Line Interface](#command-line-interface)

## Introduction

An Alpaca project can be initialized in the current directory with:

```bash
alpaca init
```

To build a project, you can run:

```bash
alpaca build
```

When posts are bundled, each post is assigned an unique string ID containing only characters in the regular expression character class `[_a-z0-9-]`

That is, post IDs only contain the characters:
- lowercase letters (from 'a' to 'z')
- digits ('0' to '9')
- dashes ('-') and underscores ('_').

Post IDs can be safely used in URLs.

## Writing a Post

An Alpaca post is a folder with a `post.md` file inside of it. An Alpaca post file is a Markdown containing YAML front matter and a body.

The YAML metadata should follow the example shown below: 

```yaml
title: 'Example Post'
date: '08-30-24 5:28PM'
description: 'An example post.'
thumbnail:
  src: '@alpaca/thumb'
  alt: 'Alt text for thumbnail.'
tags:
  - tag1
  - tag2
  - tag3
```

All fields are optional **except** "title". A post must **always** have a defined title.

### Post Images

Images used in a post should preferably **always** be inside the post folder to take advantage of Alpaca's image compression + image path resolution logic.

The `@alpaca` path alias generates a runtime path for images based on the post folder:

```
my-post/
  post.md
  cat.png
```

```md
---
title: Example Post
---
I like cats!
![cat](@alpaca/cat.png)
```

The post content becomes:

```md
I like cats!
![cat](/my-post-0.jpg)
```

And, with a [custom alias path](#image-alias):

```yaml
# alpaca.yaml
image-alias: '/blog/images/'
```

```md
I like cats!
![cat](/blog/images/my-post-0.jpg)
```

## Configuring Alpaca

Alpaca's configuration file (`alpaca.yaml`) should be at the root of your project.

It can contain the following fields:

```yaml
image-alias: '/myblog/images/'
quiet: false
log-file: false
never-infer-date: false
preserve-images: true
image-extensions:
  - .png
  - .jpg
ignore:
  - notes/**
```

### image-alias

**type**: `string`

Define how to resolve the `@alpaca` path alias for images.

By default, the `@alpaca` path alias is resolved like such:

```
/[post id]/[image]
```

You can modify the first portion of this expression—the `/`.

To make the path always relative, set image-alias to an empty string:

```yaml
image-alias: ''
```

This resolves paths as:

```
[postid]/[image]
```

To make the path resolve to a specific endpoint, set image-alias to that endpoint:

```yaml
image-alias: '/blog/images/'
```

This resolves paths as:

```
/blog/images/[postid]/[image]
```

### quiet

**type**: `boolean`

Silence log messages.

### log-file

**type**: `boolean`

When building project, write log messages to a log file.

The log file will be created in your project's root—that is, the folder where your `alpaca.yaml` file is.

### ignore

**type**: `string[]`

Tell the compiler what posts and directories to ignore through a list of glob patterns.

See the [fast-glob](https://github.com/mrmlnc/fast-glob) documentation for more guidance on glob patterns.

### never-infer-date

**type**: `boolean`

Tell compiler to never infer post date from file modification date, even when no post date is provided in post metadata.

### preserve-images

**type**: `boolean` 

Do not compress post images.

### image-extensions

**type**: `string[]`

Define what image extensions this tool should look for when searching for images.

By default, Alpaca looks for: `png, jpg, webp, gif`.

**Note:** Alpaca only compresses these formats: `png, jpg, webp`.

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
  -p, --preserve-images            do not compress images
  -e, --extensions <EXTENSION...>  image extensions to look for
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
