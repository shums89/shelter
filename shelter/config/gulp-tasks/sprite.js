import svgSprite from "gulp-svg-sprite";

export const sprite = () => {
  return app.gulp.src(`${app.path.src.svgicons}`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "SVG",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../img/icons/sprite.svg',
          inline: true, // Prepare for inline embedding
          //example: true
        },
        // css: {
        //   sprite: '../img/icons/sprite.css.svg',
        //   render: {
        //     // scss: true, // Activate Sass output (with default options)
        //     scss: {
        //       dest: '../scss/sprite.scss.scss',
        //     }
        //   }
        // }
      },
      shape: {
        id: {
          separator: '',
          // generator: 'svg-'
        },
        transform: [
          {
            svgo: {
              plugins: [
                {
                  name: 'removeXMLNS',
                  active: false
                },
                {
                  name: 'convertPathData',
                  active: false
                },
                {
                  name: 'removeViewBox',
                  active: false
                },
                // { removeXMLNS: true },
                // { convertPathData: false },
                // { removeViewBox: false },
              ]
            }
          }
        ]
      },
      svg: {
        rootAttributes: {
          // style: 'display: none;',
          // 'aria-hidden': true
        },
        xmlDeclaration: false
      }
    }))
    .pipe(app.gulp.dest(`${app.path.srcFolder}`));
}