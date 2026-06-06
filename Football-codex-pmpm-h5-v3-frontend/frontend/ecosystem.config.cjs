// PM2 ecosystem for the PmPm H5 v3 frontend.
//
// 跑的是 Next.js 的 standalone 产物（next.config.ts 里 output: "standalone"），
// 静态资源由 `postbuild` 脚本拷到 .next/standalone/.next/static。
//
// 部署流程：
//   npm run build               # 包含 postbuild 资源拷贝
//   pm2 start ecosystem.config.cjs --update-env
//   pm2 save                    # 持久化进程列表，机器重启可恢复
//
// 升级：
//   git pull && npm ci && npm run build
//   pm2 reload pmpm-h5-frontend # 0 停机重载
//
// 后端 FastAPI 仍跑在 127.0.0.1:8787，这台前端通过 next.config.ts 的 rewrites
// 在 dev 下代理；生产由 nginx 同源转发，不依赖 rewrites。
module.exports = {
  apps: [
    {
      name: "pmpm-h5-frontend",
      cwd: __dirname + "/.next/standalone",
      script: "server.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        // 3001 留给 `npm run dev`，生产构建跑在 3002，方便边开发边对照。
        PORT: "3002",
      },
      // 进程崩溃就重启，最多每 10 秒 5 次，超过则告警。
      autorestart: true,
      max_restarts: 5,
      restart_delay: 2000,
      min_uptime: "10s",
      // 内存超 512MB 自动重启（Next.js 静态站点正常 < 150MB）。
      max_memory_restart: "512M",
      out_file: __dirname + "/.next/pm2-out.log",
      error_file: __dirname + "/.next/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
