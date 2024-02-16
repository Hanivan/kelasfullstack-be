module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/main.js',
      watch: ['./dist'],
      autorestart: true,
      cron_restart: '0 * * * *',
      // interpreter: 'node@16.18.0',
    },
  ],
};
