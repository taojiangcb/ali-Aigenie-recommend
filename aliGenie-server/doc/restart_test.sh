source ~/.bash_profile
yarn install
pm2 stop aligenie_recommend_movie
pm2 del aligenie_recommend_movie
pm2 start ecosystem.config.js --env test