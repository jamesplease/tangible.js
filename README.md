object-visualizer.js
====================

Visualize Javascript objects.

## Theming & Customization

Object Visualizer is easily themeable using LESS.

#### Theme Files

Place your themes in the `./themes` directory with the following filename format:

```
{{ themeName }}.less
```

#### Color Guide

Specify variable names in your theme to change the colors of Object Visualizer.
The following is a comprehensive list of all of the variables available to you.

`lala`: This styles something
`someOtherVal`: This styles something else

#### Building Your Theme

Build with your theme by running:

```
grunt --theme={{ themeName }}
```