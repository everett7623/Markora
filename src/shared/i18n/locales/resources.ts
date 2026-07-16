import { enAi } from './en-ai';
import { en } from './en';
import { zhCNAi } from './zh-CN-ai';
import { zhCN } from './zh-CN';

export const enResources = {
  ...en,
  navigation: { ...en.navigation, ...enAi.navigation },
  pages: { ...en.pages, ...enAi.pages },
  ai: enAi.ai
} as const;

export const zhCNResources = {
  ...zhCN,
  navigation: { ...zhCN.navigation, ...zhCNAi.navigation },
  pages: { ...zhCN.pages, ...zhCNAi.pages },
  ai: zhCNAi.ai
} as const;
