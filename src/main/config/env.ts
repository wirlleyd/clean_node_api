export default {
  mongoUrl:
    process.env.MONGO_URL ||
    "mongodb://sa:4865297wod@ds025603.mlab.com:25603/clean-node-api",
  port: process.env.PORT || 5050,
};
