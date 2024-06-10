// server/src/utils/CustomError.js
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default CustomError;

/*
役割：カスタムエラークラスを定義するユーティリティ
エラーメッセージとHTTPステータスコードを保持し、エラーハンドリングを容易にする
*/