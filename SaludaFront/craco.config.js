const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignorar warnings de source map para stylis-plugin-rtl
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
      ];

      // Configurar source-map-loader para ignorar archivos problemáticos
      if (webpackConfig.module && webpackConfig.module.rules) {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach((useItem) => {
              if (useItem.loader && useItem.loader.includes('source-map-loader')) {
                useItem.options = {
                  ...useItem.options,
                  filterSourceMappingUrl: (url, resourcePath) => {
                    // Ignorar source maps para stylis-plugin-rtl
                    if (resourcePath.includes('stylis-plugin-rtl')) {
                      return false;
                    }
                    return true;
                  },
                };
              }
            });
          }
        });
      }

      return webpackConfig;
    },
  },
}; 