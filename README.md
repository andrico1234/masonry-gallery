# `masonry-gallery`

A Web Component for a Masonry layout gallery.

**[Demo](https://masonry-gallery-wc.netlify.app/)**

## Examples

General usage example:

```html
<style>
  masonry-gallery:not(:defined) {
    gap: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .masonry-gallery-column:empty {
    display: none;
  }
</style>
<script type="module" src="component-name.js"></script>

<masonry-gallery>
  <img src="https://placedog.net/600/400" alt="A random cute dog" />
  <img src="https://placedog.net/220/450" alt="A random cute dog" />
  <img src="https://placedog.net/1000/200" alt="A random cute dog" />
  <img src="https://placedog.net/909/210" alt="A random cute dog" />
  <img src="https://placedog.net/430/900" alt="A random cute dog" />
  <img src="https://placedog.net/338" alt="A random cute dog" />
</masonry-gallery>
```

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/masonry-gallery): `npm install masonry-gallery`
2. [Download the source manually from GitHub](https://github.com/andrico1234/masonry-gallery/releases) into your project.

## Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="masonry-gallery.js"></script>
```

masonry-gallery doesn't use the shadow DOM, meaning you can style it from your main CSS file.

```css
masonry-gallery {
  border: 6px dashed red;
  padding: 12px;
}

masonry-gallery > .masonry-gallery-column {
  gap: 16px;
}
```

This package barely includes any default styles, so it's completely up to you to style it.

## Features

Here are the attributes available to masonry-gallery:

| Attribute | Type     | Default | Description                                      |
| --------- | -------- | ------- | ------------------------------------------------ |
| `columns` | `string` | `"3"`   | Sets the number of columns in the masonry layout |
