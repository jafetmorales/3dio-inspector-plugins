# A-Frame Inspector Plugins by 3d.io

We love 3d content and strive to make it easily accessible and reusable. Inspector Plugins provide hosted 3d models from various open source friendly projects directly in the [A-Frame Inspector](https://github.com/aframevr/aframe-inspector).

### [Live Demo](https://archilogic-com.github.io/3dio-inspector-plugins)

![](static/inspector-plugins-001.gif)

More demos:
- [Google Blocks tag aka "gblock"](https://archilogic-com.github.io/3dio-inspector-plugins/google-blocks.html)
- [Furniture Library](https://archilogic-com.github.io/3dio-inspector-plugins/furniture-library.html)
- [Staff Picks](https://archilogic-com.github.io/3dio-inspector-plugins/staff-picks.html)

## Usage

1. Add [3d.io library](https://github.com/archilogic-com/3dio-js) script to the `<head>` section of your page right after aframe 0.7.0 (or higher):

```html
<head>
  <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
  <script src="https://dist.3d.io/3dio-js/1.x.x/3dio.min.js"></script>
</head>
<body>
  <a-scene></a-scene>
</body>
```

2. Open your page and start the A-Frame Inspector:
  - Windows: `ctrl` + `alt` + `i`
  - OSX: `control` + `option` + `i`
  
3. The `3d.io` button will be there ;) 

## Want to make changes?

### Installation

1. `git clone https://github.com/archilogic-com/3dio-inspector-plugins.git`
2. `npm install`
3. `npm start`

## Acknowledgements

- [A-Frame](https://aframe.io/)
- [three.js](https://threejs.org/)
- [Arturo Paracuellos](https://twitter.com/arturitu) (for making google blocks searchable)

## License

Distributed under an [MIT License](LICENSE).
