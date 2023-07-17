---
emoji: 🍦
title: '바닐라JS(TS)로 리액트 SPA 구현하기 | (1) 기본 세팅'
date: '2022-04-10'
categories: Dev React만들어보기
---

### 별도의 SPA 라이브러리 없이 Single page application을 만들어봅시다!

언어는 타입스크립트, 번들러는 웹팩을 사용하도록 하겠습니다. html과 css 웹팩 플러그인도 함께 설치하고, 바벨 트랜스파일러도 설치합시다. 저는 sass를 사용하기 위한 추가적인 설치를 함께 해주었습니다.

**devDependencies**
- @babel/cli
- @babel/core
- @babel/preset-env
- @babel/preset-typescript
- babel-loader
- css-loader
- html-loader
- html-webpack-plugin
- mini-css-extract-plugin
- sass
- sass-loader
- ts-loader
- typescript
- webpack
- webpack-cli
- webpack-dev-server

&nbsp;

## 1. webpack.config.js

```js
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: ['/node_modules'],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
        {
          test: /\.(css|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          use: {
            loader: 'file-loader',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    optimization: { minimize: true },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.js', '.json', '.scss'],
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    output: { path: path.join(__dirname, './dist/src'), filename: '[name].js' },
    devtool: 'source-map',
  };
};
```

&nbsp;

## 2. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "exclude": [
    "node_modules"
  ]
}
```
절대 경로를 alias를 따로 설정해주었습니다.

&nbsp;

## 3. .babelrc

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": [
                        ">= 1%"
                    ]
                }
            }
        ],
        "@babel/preset-typescript"
    ]
}
```
&nbsp;

## 4. index.html

기본적으로 화면을 띄우기 위한 html 파일이 필요하겠죠.
리액트처럼 id로 app을 가지는 div를 넣어줍시다.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanill React</title>
</head>

<body>
    <div id="app" class="app"></div>
</body>

</html>
```

&nbsp;

## 5. index.ts

```ts
const $app = document.querySelector("#app") as HTMLElement;
```

이제 페이지를 렌더링하기 위해서는 이제 뭐가 필요할까요? 컴포넌트와 컴포넌트를 렌더링하기 위한 라우터가 필요하겠죠. 다음 글에서부터 본격적으로 컴포넌트를 작성해보도록 하겠습니다.

&nbsp;

## 6. 디렉토리 구조
```
└── src
    ├── components       // 컴포넌트들
    ├── core
    ├── Component.ts     // 컴포넌트 클래스
    ├── Router.ts        // 라우터 클래스
    ├── index.html
    ├── index.ts
    ├── pages            // 페이지들
    ├── scss             // 스타일 파일들
    └── utils            // 유틸 함수들
```

```toc
```