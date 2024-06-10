// app.js
import express from 'express';
import cors from 'cors';
import routes from './routes';
// src/app.js
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

export default app;

/*
役割：Expressアプリケーションの設定と起動を行うエントリーポイント
ミドルウェアの設定や、ルーティングの定義を行う
*/