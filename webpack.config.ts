const webpack = require("webpack");

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");

const ASSET_PATH = process.env.ASSET_PATH || "/";

const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

const isDevelopment = process.env.NODE_ENV !== "production";

const plugins = isDevelopment ? [new ReactRefreshWebpackPlugin()] : [];

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        app: path.resolve(__dirname, "src", "index.tsx"),
    },

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
        clean: true,
        publicPath: ASSET_PATH,
    },

    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {
                    getCustomTransformers: () => ({
                        before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                    transpileOnly: isDevelopment,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                        },
                    },
                ],
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
            assert: require.resolve("assert"),
        },
        extensions: fileExtensions.map((extension) => "." + extension).concat([".js", ".jsx", ".ts", ".tsx", ".css"]),
    },

    plugins: [
        ...[
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"],
            }),
            new webpack.ProgressPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "public", "index.html"),
                filename: "index.html",
                chunks: ["app"],
            }),
        ],
        ...plugins,
    ],
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, "build"),
        },
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
    devtool: process.env.NODE_ENV && process.env.NODE_ENV !== "production" ? "source-map" : undefined,
};
