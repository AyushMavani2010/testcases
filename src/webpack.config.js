const path = require('path');

module.exports = {
  // Other webpack configurations...
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ensure it resolves TypeScript and JS files
  },
};
