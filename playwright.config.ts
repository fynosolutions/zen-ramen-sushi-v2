import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',fullyParallel:true,workers:3,reporter:'list',use:{baseURL:'http://127.0.0.1:3001',headless:true,launchOptions:{channel:'msedge'}},webServer:{command:'npm run preview',url:'http://127.0.0.1:3001',reuseExistingServer:true},timeout:30000});
