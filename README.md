# Toptal REST series

A project made for the free _Building a Node.js/TypeScript REST API_ series at the Toptal Engineering Blog.

This branch contains some setup for linting and prettifying code that is outside the scope of the series.

In addition to the inclusion of `.eslintrc.json` and `.prettierrc` files, some development dependencies were added to `package.json`, namely `@typescript-eslint/eslint-plugin eslint-plugin-mocha eslint-plugin-prettier eslint-config-prettier`.

You likely have to `npm i -g prettier` as well.

From here (after running `npm i`) there are two things you can do.

## One-time Prettification

For this, you can go to the project root, and run:

``` sh
find . -name '*.js' -or -name '*.ts' | grep -v .history | grep -v dist | grep -v node_modules | xargs prettier --write --single-quote
```

## Continuous Prettification and Linting

In this scenario, whenever you save a file in VSCode (or VSCodium) that you were working on, it automatically runs Prettier and ESLint on it.

To set it up, find your `settings.json` file (e.g., `~/.config/VSCodium/User/settings.json`) and add these lines to it:

``` json
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": ["typescript", "javascript"]
```

With that, try making some changes to the project, like adding a line `const neverused    =1;`.  If all went well, Prettier will reformat your code for you, and ESLint will generate warnings in the Problems pane about the unused variable `neverused`.

* * *

Visit https://www.toptal.com/blog and subscribe to our newsletter to read great articles!