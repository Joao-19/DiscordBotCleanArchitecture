interface EnvConfig {
  discord: {
    commands: {
      shortcutIdentifier: string;
    };
  };
}

declare const envConfig: EnvConfig;

export default envConfig;