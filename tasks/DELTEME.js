const spawn = require('child_process').spawn
const gulp = require('gulp')
const del = require('del')
const chalk = require('chalk')

// configs

const dest = 'watch2'

// tasks

// const watch2 = gulp.series(cleanwatch2Dir, bundleScripts)

function cleanwatch2Dir () {
  return del([dest])
}

function bundleScripts () {
  return new Promise((resolve, reject) => {
    const ls = spawn('rollup', ['-c','tasks/rollup.config.js'], {shell: true} )
    ls.stdout.on('data', (data) => {
      console.log(`rollup: ${data}`)
    })
    ls.stderr.on('data', (data) => {
      console.error(chalk.red(`rollup: ${data}`))
    })
    ls.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        throw new Error(`rollup: exited with code ${code}`)
        reject()
      }
    })
  })
}

// export watch2 task

// module.exports = watch2

exports.default = function() {
  // You can use a single task
  watch('src/*.css', css);
  // Or a composed task
  watch('src/*.js', series(cleanwatch2Dir, bundleScripts));
};