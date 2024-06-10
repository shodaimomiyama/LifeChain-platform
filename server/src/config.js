// server/src/config.js
const config = {
    encryptionAlgorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    encryptionKeyLength: process.env.ENCRYPTION_KEY_LENGTH || 32,
    // その他の設定値...
};

export default config;

/*
役割：アプリケーションの設定値を管理するファイル
環境変数から設定値を読み込み、各コンポーネントで使用する
*/