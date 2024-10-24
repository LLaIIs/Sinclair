/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/cadastro` | `/(auth)/code` | `/(auth)/entrada` | `/(auth)/login` | `/(auth)/password` | `/(auth)/redefinir` | `/(tabs)` | `/(tabs)/dicas` | `/(tabs)/explore` | `/(tabs)/favorite` | `/(tabs)/map` | `/(tabs)/userConfig` | `/_sitemap` | `/cadastro` | `/chats` | `/code` | `/details` | `/dicas` | `/entrada` | `/explore` | `/favorite` | `/login` | `/map` | `/password` | `/profile` | `/redefinir` | `/search` | `/settings` | `/userConfig`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
