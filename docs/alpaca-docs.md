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

### Images

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

And, with a [custom alias path](#imageAlias):

```yaml
# alpaca.yaml
imageAlias: '/blog/images/'
```

```md
I like cats!
![cat](/blog/images/my-post-0.jpg)
```

## Configuration

An `alpaca.yaml` file is required at your project root.

```yaml
imageAlias: '/myblog/images/'
quiet: false
logFile: false
neverInferDate: false
preserveImages: true
imageExtensions:
  - .png
  - .jpg
ignore:
  - notes/**
```

### imageAlias

**type**: `string`

Define how to resolve the `@alpaca` path alias for images.

By default, the `@alpaca` path alias is resolved like such:

```
/[post id]/[image]
```

You can modify the first portion of this expression—the `/`.

To make the path always relative, set imageAlias to an empty string:

```yaml
imageAlias: ''
```

This resolves paths as:

```
[postid]/[image]
```

To make the path resolve to a specific endpoint, set imageAlias to that endpoint:

```yaml
imageAlias: '/blog/images/'
```

This resolves paths as:

```
/blog/images/[postid]/[image]
```

### quiet

**type**: `boolean`

Silence log messages.

### logFile

**type**: `boolean`

When building project, write log messages to a log file.

The log file will be created in your project's root—that is, the folder where your `alpaca.yaml` file is.

### ignore

**type**: `string[]`

Tell the compiler what posts and directories to ignore through a list of glob patterns.

See the [fast-glob](https://github.com/mrmlnc/fast-glob) documentation for more guidance on glob patterns.

### neverInferDate

**type**: `boolean`

Tell compiler to never infer post date from file modification date, even when no post date is provided in post metadata.

### preserveImages

**type**: `boolean` 

Do not compress post images.

### imageExtensions

**type**: `string[]`

Define what image extensions this tool should look for when searching for images.

By default, Alpaca looks for: `png, jpg, webp, gif`.

**Note:** Alpaca only compresses these formats: `png, jpg, webp`.
