自家製剤加算クイズサイト：Googleスプレッドシート送信版

【入っているもの】
- index.html：画面
- style.css：デザイン
- script.js：クイズと送信処理
- config.js：Google Apps ScriptのURLを設定する場所
- apps_script.gs：スプレッドシート側に貼り付けるコード

【Googleスプレッドシート連携手順】
1. Googleスプレッドシートを新規作成する
2. 下のシート名を「回答」にする
3. メニューの「拡張機能」→「Apps Script」を開く
4. apps_script.gs の中身を全部コピーして貼り付ける
5. 保存する
6. 右上の「デプロイ」→「新しいデプロイ」
7. 種類の選択で「ウェブアプリ」を選ぶ
8. 実行するユーザー：自分
9. アクセスできるユーザー：全員
10. デプロイして、表示されたウェブアプリURLをコピーする
11. config.js の GAS_WEB_APP_URL = ""; の "" の中にURLを貼る
12. GitHub Pagesに index.html / style.css / script.js / config.js をアップロードする

【注意】
- apps_script.gs はGitHub Pagesに置かなくてOKです。
- スプレッドシート側のApps Scriptに貼る専用ファイルです。
- GitHub Pagesではなく、スマホで直接index.htmlを開いた場合は送信できないことがあります。
