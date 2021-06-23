const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const buffer = require("vinyl-buffer")
const browserSync = require("browser-sync").create()
const del = require("del")
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const gulp = require("gulp")
const gulpIf = require("gulp-if")
const plumber = require("gulp-plumber")
const rename = require("gulp-rename")
const { createGulpEsbuild } = require("gulp-esbuild")
const sourcemaps = require("gulp-sourcemaps")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const ejs = require("gulp-ejs")
const htmlmin = require("gulp-htmlmin")

const src = "./src"
const dest = "./build"

gulp.task("delete-dest", () => del([dest]))

function reload(done) {
    browserSync.reload()
    done()
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: `${dest}`
        },
        port: process.env.PORT,
        ui: false
    })
    done()
}

function css(config) {
    const css = () => gulp.src(`${src}/sass/**/*.{sass,scss}`)
        .pipe(plumber())
        .pipe(gulpIf(config.sourcemaps, sourcemaps.init()))
        .pipe(sass.sync({
            outputStyle: "compressed",
            includePaths: ["../../node_modules/"]
        }))
        .on("error", sass.logError)
        .pipe(rename({ basename: "main", suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulpIf(config.sourcemaps, sourcemaps.write("")))
        .pipe(gulp.dest(`${dest}/css`))
        .pipe(browserSync.stream())
    return css
}

function html() {
    return gulp.src(`${src}/*.ejs`)
        .pipe(plumber())
        .pipe(ejs({
            process: {
                env: process.env
            }
        }))
        .pipe(rename({ extname: ".html" }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            sortAttributes: true,
            sortClassName: true
        }))
        .pipe(gulp.dest(`${dest}`))
}

function collectEnv(keys) {
    return Object.fromEntries(
        keys.map((key) => [
            "process.env." + key,
            JSON.stringify(process.env[key])
        ])
    )
}

function script(config) {
    const script = () => {
        const esbuild = createGulpEsbuild({
            pipe: true,
            incremental: config.incremental
        })

        return gulp.src(`${src}/js/main.ts`)
            .pipe(esbuild({
                bundle: true,
                minify: true,
                sourcemap: config.sourcemaps && "external",
                platform: "browser",
                define: collectEnv([])
            }))
            .pipe(buffer())
            .pipe(gulp.dest(`${dest}/js`))
    }
    return script
}

function assets() {
    return gulp.src(`${src}/assets/**`)
        .pipe(gulp.dest(`${dest}/assets`))
}

function makeBuildTasks(config) {
    return ["delete-dest", assets, css(config), script(config), html]
}

const devBuildTasks = makeBuildTasks({
    sourcemaps: true,
    incremental: true
})
const prodBuildTasks = makeBuildTasks({
    sourcemaps: false
})

const watch = () => gulp.watch(
    [`${src}/*.ejs`, `${src}/**/*.ejs`, `${src}/js/**/*.js`, `${src}/sass/**/*.{sass,scss}`, `${src}/assets/**/*.*`],
    gulp.series(...devBuildTasks, reload)
)

const dev = gulp.series(...devBuildTasks, serve, watch)
const prod = gulp.series(...prodBuildTasks)

exports.default = dev
exports.dev = dev
exports.build = prod
