import "dotenv/config";

export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
      GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    },
    plugins: [
      [
        "expo-secure-store",
        // {
        //   configureAndroidBackup: true,
        //   faceIDPermission:
        //     "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        // },
      ],
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID.",
        },
      ],
    ],
    ios: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
      },
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_API_KEY,
        },
      },
    },
  },
};
