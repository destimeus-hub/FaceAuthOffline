module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(postprocessing|@react-native|react-native|@react-navigation|react-native-gesture-handler)/)',
  ],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
};
