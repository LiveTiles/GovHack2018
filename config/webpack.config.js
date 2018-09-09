const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const configName = process.env.NODE_ENV;
const buildPath = path.join(__dirname, '../ChromeExtension/dist');
const configFolderPath = path.resolve(__dirname, '../config');
const configPath = path.resolve(__dirname, `../config/environment/development.config`);
const nodeModulesPath = path.join(__dirname, '../node_modules');
const outPublicPath = '/';
const publicHtmlPath = path.join(__dirname, '../public/index.html');
const publicPath = path.join(__dirname, '../public');
const sourcePath = path.join(__dirname, '../src');
const sourcePathIndex = path.join(__dirname, '../src/index.ts');
const webConfig = path.join(__dirname, './web.config');

module.exports = {
    bail: true,
    entry: {
        main: sourcePathIndex,
        vendor: ['babel-polyfill', 'react', 'react-dom', 'whatwg-fetch']
    },
    output: {
        path: buildPath,
        publicPath: outPublicPath,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunk.js',
    },
    target: 'web',
    devtool: 'source-map',
    resolve: {
        alias: {
            config: configPath
        },
        extensions: ['.js', '.ts', '.tsx'],
        mainFields: ['main'],
        plugins: [
            new ModuleScopePlugin(sourcePath, [configPath]),
        ]
    },
    module: {
        strictExportPresence: true,
        loaders: [
            {
                test: /\.(ts|tsx)$/,
                loader: require.resolve('tslint-loader'),
                enforce: 'pre',
                include: [configFolderPath, sourcePath]
            },

            {
                test: /\.(ts|tsx)$/,
                include: [configFolderPath, sourcePath],
                loader: require.resolve('ts-loader')
            },

            {
                test: /\.js$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: sourcePath,
            },

            {
                test: /\.css$/,
                include: [
                    sourcePath,
                    path.join(nodeModulesPath, '/@lt/lt-bots-webchat/built/'),
                    path.join(nodeModulesPath, '/font-awesome/css/')
                ],
                use: ExtractTextPlugin.extract({
                    fallback: require.resolve('style-loader'),
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                camelCase: true,
                                importLoaders: 1,
                                localIdentName: '[local]__[hash:base64:5]',
                                minimize: true,
                                modules: true,
                                sourceMap: true
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-import')({ addDependencyTo: webpack }),
                                    require('postcss-url')(),
                                    require('postcss-cssnext')(),
                                    require('postcss-reporter')(),
                                ],
                            },
                        },
                    ],
                }),
            },

            {
                test: /\.svg$/,
                exclude: [/font-awesome/, /lt-bots-webchat/],
                loader: require.resolve('svg-inline-loader')
            },

            {
                test: [/\.svg$/],
                include: [/lt-bots-webchat/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:8].[ext]',
                },
            },

            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:8].[ext]',
                },
            },

            {
                test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
                include: nodeModulesPath,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[hash:8].[ext]',
                        publicPath: '../'
                    }
                },
            },

            {
                include: [/font-awesome/],
                exclude: [
                    /\.(js|jsx)(\?.*)?$/,
                    /\.(ts|tsx)(\?.*)?$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.html$/,
                    /\.jpe?g$/,
                    /\.json$/,
                    /\.png$/,
                    /\.s?css$/,
                    /\.woff2?(\?v=\d+\.\d+\.\d+)?$/
                ],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'media/[name].[hash:8].[ext]',
                    publicPath: '../'
                },
            }
        ],
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([{
            from: publicPath,
            to: buildPath,
            ignore: [
                "**/*.gitignore",
                "**/*.html",
                "**/*.map",
                "js/main.*.js"
            ]
        }]),
        new CopyWebpackPlugin([{ from: webConfig, to: buildPath }]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.DIRECTLINE_SECRET': JSON.stringify(process.env.DIRECTLINE_SECRET),
            'process.env.BOT_FRAMEWORK_ID': JSON.stringify(process.env.BOT_FRAMEWORK_ID),
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
        new HtmlWebpackPlugin({
            template: publicHtmlPath,
            filename: 'index.html',
            inject: true,
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: outPublicPath
        }),
        configName !== 'development' && new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                comparisons: false,
                dead_code: true,
                unused: true
            },
            output: {
                comments: false,
                ascii_only: true,
            },
            sourceMap: true,
        })
    ].filter(plugin => !!plugin),
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    }
};