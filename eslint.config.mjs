import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([...nextVitals, ...nextTs, { rules: { '@next/next/no-img-element': 'off',
  // 本站是静态导出,站内链接故意用普通 <a>(见 components/StaticLink.tsx 的说明);加了日期式文章路由后这条规则开始对原有的 <a href="/happy-hour/"> 报错
  '@next/next/no-html-link-for-pages': 'off' } }, globalIgnores(['out/**','.next/**','docs/**'])]);
