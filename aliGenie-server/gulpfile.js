const gulp = require("gulp");
const shell = require("shelljs");
const path = require('path');

let workSpaceDir = __dirname;


gulp.task('cpViews', function () {
  let viewDir = `${workSpaceDir}/src/views/**/*.*`;
  var stream = gulp.src([viewDir]);
  return stream.pipe(
    gulp.dest(`${workSpaceDir}/bin/src/views`)
  );
})

gulp.task('cpAssets', function () {
  let assetsDir = `${workSpaceDir}/src/assets/**/*.*`;
  var stream = gulp.src([assetsDir]);
  return stream.pipe(
    gulp.dest(`${workSpaceDir}/bin/src/assets`)
  );
})


gulp.task("cpFile", gulp.series('cpViews', 'cpAssets'), function () {
  let docDir = `${workSpaceDir}/doc/**/*.*`;
  let packageFile = `${workSpaceDir}/package.json`;
  let yarnFile = `${workSpaceDir}/yarn.lock`
  var stream = gulp.src([docDir, packageFile, yarnFile]);
  return stream.pipe(
    gulp.dest(`${workSpaceDir}/bin/`)
  );
});