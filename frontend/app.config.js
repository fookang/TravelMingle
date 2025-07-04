import "dotenv/config";

export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
    plugins: [
      [
        "expo-secure-store",
        // {
        //   configureAndroidBackup: true,
        //   faceIDPermission:
        //     "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        // },
        "expo-router",
      ],
    ],
  },
};
