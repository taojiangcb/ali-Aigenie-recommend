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

gulp.task("cpDoc", function () {
  let docDir = `${workSpaceDir}/doc/*.*`;
  let packageFile = `${workSpaceDir}/package.json`;
  // let packageLockFile = '';//`${workSpaceDir}/package-lock.json`
  let yarnFile = `${workSpaceDir}/yarn.lock`
  var stream = gulp.src([docDir, packageFile, yarnFile]);
  return stream.pipe(
      gulp.dest(`${workSpaceDir}/bin/`)
  );
});

gulp.task("cpFile", gulp.series('cpViews', 'cpAssets','cpDoc'));

gulp.task('tsc', function () {return exec('tsc -p ./tsconfig.json');})
gulp.task('rsync:test', function () {
  let dist = path.resolve(__dirname, './bin/');
  return exec(`rsync -avz --rsh=ssh ${dist}/* root@47.100.202.222:/opt/resource/aligenie_recommend_movie`);
})
gulp.task('deploy:test',gulp.series('tsc','cpFile','rsync:test'));

async function exec(cmd) {
  let t = Date.now();
  return new Promise((resolve, reject) => {
      shell.exec(cmd, (code, stdout, stderr) => {
          if (stderr) { 
            console.log(stderr);
            resolve(stderr);
          }
          console.log(`执行成功:${cmd} 耗时:${Date.now() - t} 毫秒`);
          resolve(stderr);
      });
  });
}