// server/src/models/digitalArchive/DigitalArchive.js
import mongoose from 'mongoose';

const digitalArchiveSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    encryptedContent: {
        type: String,
        required: true,
    },
    encryptedSymmetricKey: {
        type: String,
        required: true,
    },
    irysId: {
        type: String,
        required: true,
    },
    arweaveId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const DigitalArchive = mongoose.model('DigitalArchive', digitalArchiveSchema);

export default DigitalArchive;

/*
役割：デジタルアーカイブのメタデータを表現するモデル
デジタルアーカイブのオーナー、暗号化されたコンテンツ、暗号化された対称鍵、IrysとArweaveのID、作成日時などの情報を保持する
*/

/*
Modelはデータ管理の役割の責任を持つモジュール(=パーツ)となります。

具体的には次のようなことを行います。

Modelの役割
データベース(DB)とやり取りを行う
データの操作を行う(取得・作成・更新・削除)
データの加工を行う(Modelが保持しているデータを組み合わせて、求めているデータ形式に整形する)
上記のようなデータ管理をModelに集中させることで、他の「Controller」「View」からデータ管理の実装を取り除くことが出来ます。

「データ管理をModelに集中させること」というのは、別の言い方をすると、「データ管理以外のコードはModelには含めない」ということになります。

「Controller」「View」からデータ管理のコードをなくすことで、データ管理周りの挙動がおかしい場合は、「Model」の実装に何か問題があることがすぐにわかります。
*/