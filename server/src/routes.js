// src/routes.js
import express from 'express';
import AuthController from './controllers/auth/AuthController';
import DigitalArchiveController from './controllers/digitalArchive/DigitalArchiveController';
import authMiddleware from './middlewares/auth';

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

router.post('/api/digitalArchive', authMiddleware, DigitalArchiveController.create);
router.get('/api/digitalArchive/:id', authMiddleware, DigitalArchiveController.get);
router.put('/api/digitalArchive/:id', authMiddleware, DigitalArchiveController.update);
router.delete('/api/digitalArchive/:id', authMiddleware, DigitalArchiveController.remove);

export default router;
// import express from 'express';
// const router = express.Router();
// import AuthController from './controllers/auth/AuthController';
// import DigitalArchiveController from './controllers/digitalArchive/DigitalArchiveController';

// router.post('/auth/login', AuthController.login);
// router.post('/auth/register', AuthController.register);

// router.post('/api/digitalArchive', DigitalArchiveController.create);
// router.get('/api/digitalArchive/:id', DigitalArchiveController.get);
// router.put('/api/digitalArchive/:id', DigitalArchiveController.update);
// router.delete('/api/digitalArchive/:id', DigitalArchiveController.remove);

// export default router;

/*
役割：APIエンドポイントとコントローラーのマッピングを定義するルーティングファイル
各エンドポイントに対応するHTTPメソッドとコントローラーの関数を定義する
*/

/*
「POST」はクライアントからサーバーにデータを送信するときに使います。
新規にアカウントを作成するとき、ブログなどに新しく投稿するときなど「新規作成」で使われるのが一般的です。
POSTが使われる場面
Webページ上のフォームからデータを送る
SNSなどのアカウントを新しく作成するとき
新しくブログを投稿するとき
*/

/*
「PUT」もPOSTと同様にクライアントからサーバーにデータを送信するときに使います。
しかし、新規作成より、既存データの「更新」で使われるのが一般的です。
具体的には次のような場面でPUTが使われます。
PUTが使われる場面
既存アカウントに追加の情報を送る
既存のブログ記事やコメントなどの更新
*/

/*
「DELETE」は既存データを削除したいときに使います。
具体的には次のような場面でDELETEが使われます。
DELETEが使われる場面
既存アカウントの削除
既存のブログ記事やコメントなどの削除
*/




//mongodb+srv://mmymshd52:87GfozCycGAHRNe5@cluster0.d1byhec.mongodb.net/