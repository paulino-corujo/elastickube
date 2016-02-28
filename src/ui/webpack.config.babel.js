/* eslint no-process-env:0 */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';
const webpackConfig = {

    entry: {
        elastickube: path.resolve(__dirname, 'app/module.js'),
        vendor: [
            'jquery',
            'angular',
            'angular-animate',
            'angular-aria',
            'angular-material',
            'angular-cookies',
            'angular-password',
            'angular-ui-router',
            'angular-ui-grid/ui-grid',
            'flux',
            'lodash',
            'moment',
            'normalize.css/normalize.css',
            'roboto-fontface/css/roboto-fontface.css',
            'angular-ui-grid/ui-grid.css',
            'angular-material/angular-material.css'
        ]
    },

    resolve: {
        root: [
            path.resolve(path.join(__dirname, 'app')),
            path.resolve(__dirname)
        ]
    },

    module: {
        loaders: [
            { test: require.resolve('jquery'), loader: 'expose?jQuery' },
            { test: /\.json$/, exclude: /\/(node_modules)\//, loader: 'json' },
            { test: /\.js$/, exclude: /\/(node_modules)\//, loader: 'ng-annotate!babel!eslint' },
            { test: /\.css/, loader: ExtractTextPlugin.extract('style', 'css') },
            { test: /\.less/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
            { test: /\.html/, exclude: /\/(components)\//, loader: 'html', include: /\/(app)\// },
            {
                test: /\.html$/,
                include: /\/(components)\//,
                loader: `ngtemplate?relativeTo=${path.resolve(__dirname, '/app/')}/&prefix=./!html`
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /\/(fonts)\//,
                loader: 'file?name=assets/images/[name]-[hash].[ext]!img'
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/i,
                include: /\/(fonts|angular-ui-grid)\//,
                loader: 'file?name=assets/fonts/[name]-[hash].[ext]'
            }
        ]
    },

    postcss: () => ({
        defaults: [
            autoprefixer({
                browsers: ['last 2 versions', 'ie >= 10']
            })]
    }),

    plugins: [
        new webpack.OldWatchingPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /uk/),
        new HtmlWebpackPlugin({ template: './index.html', favicon: './favicon.png' }),
        new ExtractTextPlugin(isProduction ? 'assets/css/[name]-[chunkhash].css' : 'assets/css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor',
            isProduction ? 'assets/js/[name]-[chunkhash].js' : 'assets/js/[name].js', Infinity)
    ],

    output: {
        path: path.join(__dirname, process.env.BUILD_FOLDER || '../../build/ui'),
        publicPath: '/',
        filename: isProduction ? 'assets/js/[name]-[chunkhash].js' : 'assets/js/[name].js'
    },

    stats: {
        children: false
    },

    eslint: {
        failOnWarning: isProduction
    }
};

export default webpackConfig;
