module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'], // Or 'metro-react-native-babel-preset' depending on your setup

    plugins: [
      'react-native-reanimated/plugin', // Reanimated plugin for React Native
      [
        'module:react-native-dotenv', // Add dotenv plugin for environment variables
        {
          envName: 'APP_ENV', // Name of your environment file (for example .env)
          moduleName: '@env', // Import environment variables as '@env'
          path: '.env', // Path to your .env file
          safe: false, // Allows loading variables without validation (set to true to validate)
          allowUndefined: true, // Allow undefined variables
          verbose: false // Disable verbose logging
        }
      ]
    ],
  };
};
