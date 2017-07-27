import gulp from 'gulp';
import {ROOT_DIR} from './build/utils/consts';
import * as babel from 'babel-core';
import writeFile from './build/utils/writeFile';

const log = (...args) => {
    console.log(...args);
};

const output_es6 = () => {
    log('generating /dist/es6/index.js');
    return gulp.src(`${ROOT_DIR}/src/index.js`)
            .pipe(gulp.dest(`${ROOT_DIR}/dist/es6`));
};

const output_es5 = () => {
    log('transpiling /dist/es6/index.js');
    return new Promise((resolve, reject) => {
        babel.transformFile(`${ROOT_DIR}/dist/es6/index.js`, {
            //ast: false
            // babelrc: false,
            // presets: ["es2015"],
            // plugins: [
            //     "transform-remove-strict-mode"
            // ]
        }, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve(result.code);
            }
        });
    }).then((code) => {
        log('generating /dist/es5/index.js');
        return writeFile(`${ROOT_DIR}/dist/es5/index.js`, code)
    });
};

const build = gulp.series(output_es6, output_es5);

gulp.task('build', build);
gulp.task('default', build);