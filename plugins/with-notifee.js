const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withNotifee(config) {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;

    if (!gradle.includes("implementation project(':notifee_react-native')")) {
      config.modResults.contents = gradle.replace(
        /dependencies\s?{([\s\S]*?)}/,
        `dependencies {
    implementation project(':notifee_react-native')
    $1
}`
      );
    }

    return config;
  });
};
