npm install yarn -g
yarn install
yarn add pm2 -g
pm2 stop aligenie_recommend_movie
pm2 del aligenie_recommend_movie
pm2 start ecosystem.config.js --env production 