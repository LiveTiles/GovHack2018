const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const configFolderPath = path.resolve(__dirname, './');
const configPath = path.resolve(__dirname, `./environment/${`${process.env.NODE_ENV}.` || ''}config`);
const nodeModulesPath = path.join(__dirname, '../node_modules');
const outPublicPath = '/';
const publicHtmlPath = path.join(__dirname, '../public/index.html');
const publicPath = path.join(__dirname, '../public');
const sourcePath = path.join(__dirname, '../src');
const sourcePathIndex = path.join(__dirname, '../src/index.ts');

module.exports = {
    entry: {
        main: sourcePathIndex,
        vendor: ['babel-polyfill', 'react', 'react-dom', 'whatwg-fetch']
    },
    output: {
        path: publicPath,
        pathinfo: true,
        publicPath: outPublicPath,
        filename: 'js/bundle.js',
        chunkFilename: 'js/[name].chunk.js',
    },
    target: 'web',
    devtool: 'cheap-module-source-map',
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
                include: [configFolderPath, sourcePath],
                options: {
                    typeCheck: true,
                }
            },

            {
                test: /\.(ts|tsx)$/,
                include: [configFolderPath, sourcePath],
                use: [
                    require.resolve('react-hot-loader'),
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
            },

            {
                test: /\.js$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: sourcePath,
            },

            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: true,
                            camelCase: true,
                            importLoaders: 1,
                            localIdentName: '[local]__[hash:base64:5]'
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
                                require('postcss-browser-reporter')({ disabled: false }),
                            ],
                        },
                    },
                ],
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
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[hash:8].[ext]',
                        publicPath: './'
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
                },
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ template: publicHtmlPath }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.NamedModulesPlugin(),
        new WatchMissingNodeModulesPlugin(nodeModulesPath)
    ],
    devServer: {
        compress: true,
        contentBase: publicPath,
        hot: true,
        historyApiFallback: {
            disableDotRule: true
        },
        inline: true,
        open: true,
        overlay: false,
        port: 3030,
        publicPath: outPublicPath,
        stats: {
            warnings: false,
            publicPath: false
        },
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/,
        }
    },
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    performance: {
        hints: false,
    },
};