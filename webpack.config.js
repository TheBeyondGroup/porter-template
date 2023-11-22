const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Environments
const env =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV !== "development";
const sourceMapType = isEnvDevelopment
  ? "cheap-module-source-map"
  : "source-map";

const TAILWIND_ENTRY = path.resolve(
  __dirname,
  "theme/assets/styles/tailwind.css",
);

module.exports = {
  mode: env,
  devtool: sourceMapType,
  infrastructureLogging: {
    level: "error",
  },
  cache: {
    buildDependencies: {
      config: [__filename],
    },
    type: "filesystem",
  },
  optimization: {
    runtimeChunk: {
      name: "manifest",
    },
    splitChunks: {
      chunks: isEnvProduction ? "async" : "all",
      cacheGroups: {
        defaultVendors: false,
        commonVendors: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: isEnvProduction ? "initial" : "all",
          enforce: true,
          priority: 1,
        },
      },
    },
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
        // `terserOptions` options will be passed to `esbuild`
        // Link to options - https://esbuild.github.io/api/#minify
        // Note: the `minify` options is true by default (and override other `minify*` options), so if you want to disable the `minifyIdentifiers` option (or other `minify*` options) please use:
        // terserOptions: {
        //   minify: false,
        //   minifyWhitespace: true,
        //   minifyIdentifiers: false,
        //   minifySyntax: true,
        // },
        terserOptions: {},
      }),
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
      }),
    ],
  },
  entry: {
    app: ["./theme/assets/scripts/app.js"],
    tailwind: ["./theme/assets/styles/tailwind.css"],
  },
  output: {
    filename: "[name].min.js",
    chunkFilename: isEnvDevelopment ? "[id].js" : "[name].[chunkhash].js",
    path: path.resolve(__dirname, "_build/theme/assets"),
    publicPath: "auto",
    sourceMapFilename: "[file].map",
    clean: true,
  },
  externals: {
    Shopify: "Shopify",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
      runtime: false,
    }),
    new CopyPlugin({
      patterns: [
        "theme/assets/styles/static",
        "theme/assets/scripts/static",
        "theme/assets/fonts",
        "theme/assets/images",
      ].map((from) => ({
        from,
        noErrorOnMissing: true,
        info: { minimized: true },
        to: "[name][ext]",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/config"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../config",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/layout"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../layout",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/locales"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../locales",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/snippets"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../snippets",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/sections"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../sections",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/templates"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: "../templates",
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
    new CopyPlugin({
      patterns: ["theme/components/**/*.liquid"].map((from) => ({
        from,
        noErrorOnMissing: true,
        to: ({ absoluteFilename }) => {
          const paths = absoluteFilename.split("/");

          const fileName = paths[paths.length - 1];
          const isSnippet = fileName.includes("snippet");
          const isSection = fileName.includes("section");
          if (isSnippet) {
            const output = fileName.replace(/.snippet/gi, "");
            return path.resolve(__dirname, `_build/theme/snippets/${output}`);
          } else if (isSection) {
            const output = fileName.replace(/.section/gi, "");
            return path.resolve(__dirname, `_build/theme/sections/${output}`);
          }
        },
        transform: { transformer: (content) => content, cache: true },
      })),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        options: {
          // JavaScript version to compile to
          target: "es2015",
        },
      },
      {
        test: /\.css$/i,
        exclude: TAILWIND_ENTRY,
        use: ["style-loader", "css-loader"],
      },
      {
        test: TAILWIND_ENTRY,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                hideNothingWarning: true,
              },
            },
          },
        ],
      },
    ],
  },
};
