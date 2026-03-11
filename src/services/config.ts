class AppConfig {
  getBaseUrl(): string {
    const baseUrl ="/api";
    return baseUrl;
  }
}

const appConfig = new AppConfig();

export default appConfig;
