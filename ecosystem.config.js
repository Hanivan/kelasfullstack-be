module.exports = {
  apps: [
    {
      name: 'api-mini-socmed',
      script: 'dist/main.js',
      watch: ['./dist'],
      autorestart: true,
      cron_restart: '0 * * * *',
      // interpreter: 'node@16.18.0',
    },
  ],
};
