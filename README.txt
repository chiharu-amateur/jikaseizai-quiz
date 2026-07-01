自家製剤加算クイズ Googleスプレッドシート自動回収版

【GitHubで編集するところ】
script.js を開いて、次の行を探してください。

const SUBMIT_URL = "ここにGoogle Apps ScriptのウェブアプリURLを貼る";

この "ここに..." の部分を、Apps Scriptで作ったURLに置き換えます。
例：
const SUBMIT_URL = "https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec";

【Apps Scriptに貼るコード】
apps_script_code.js の中身を、Google Apps Script の Code.gs に貼り付けます。

【公開設定】
デプロイ → 新しいデプロイ → ウェブアプリ
実行するユーザー：自分
アクセスできるユーザー：全員

【GitHubにアップロードするファイル】
index.html
style.css
script.js

※問題文は変更していません。
