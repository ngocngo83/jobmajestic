# Job Majestic Classic Theme 2.0

The theme is build with Gulp, and Nunjucks

## Prerequisite

1. NPM
2. GULP

## Environment Setup

1. Install NPM. Download and install
   from [Download NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Open Shell Terminal, and navigate to the project root directory.
3. Install GULP

```sh
npm install --global gulp-cli
```

4. install dependencies:

```sh
npm install
```

## Directory Structures

```
config
dist
src
 |_assets
    |_css
    |_img
    |_js
    |_plugins
    |_3rd
 |_templates
    |_layouts
    |_macros
    |_components
    |_partials
```

## Development

Initial build

```sh
gulp build
```

Start development watch

```sh
gulp
```

## API Summary

API usages

```sh
gulp          # start the development watch
gulp build    # build everything from the 'src' directory
gulp html     # build src HTML pages only
gulp css      # build src CSS files only
gulp js       # process src js scripts only
gulp img      # process src images only
gulp clean    # delete all selected files/ directories from 'dist' directory
gulp destroy  # delete everything in the 'dist' directory
``` 

## Credits

V. Zang, Loo

Made with [Jobmajestic](https://www.jobmajestic.com/)