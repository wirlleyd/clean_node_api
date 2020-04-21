import express from "express";
import setupMiddelwares from "./middlewares";

const app = express();
setupMiddelwares(app);

export default app;
