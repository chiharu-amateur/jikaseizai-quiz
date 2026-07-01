const SUBMIT_URL = "https://script.google.com/macros/s/AKfycbxqkXjpicbRdZz6GMF3dN6nhMR9JjcNH4X-vgVV8w7jpeLewTsvhIROTOrtR6Ad_qxQ/exec";

const questions = [
  {
    "category": "割錠",
    "text": "処方医の指示により、規格のない用量にするため錠剤を割錠した。自家製剤加算は算定できる。",
    "answer": true,
    "explanation": "医師の指示に基づき、既製品で対応できない用量へ調製する場合は算定対象になり得ます。"
  },
  {
    "category": "割錠",
    "text": "患者が飲みやすいように、薬剤師判断のみで錠剤を半錠にした。自家製剤加算は算定できる。",
    "answer": false,
    "explanation": "自家製剤加算は原則として処方医の指示が必要です。薬剤師判断のみでは算定できません。"
  },
  {
    "category": "粉砕",
    "text": "嚥下困難のため、医師の指示で錠剤を粉砕したが、同一成分・同一規格の散剤が薬価収載されている。自家製剤加算は算定できる。",
    "answer": false,
    "explanation": "同一成分・同一規格などで対応できる既製剤がある場合は、原則として自家製剤加算は算定できません。"
  },
  {
    "category": "脱カプセル",
    "text": "医師の指示でカプセルを脱カプセルし、既製剤で対応できない服用形態にした。自家製剤加算は算定できる場合がある。",
    "answer": true,
    "explanation": "医師の指示があり、既製剤で対応できない場合は算定対象になり得ます。"
  },
  {
    "category": "一包化との違い",
    "text": "複数の錠剤を飲み忘れ防止のために一包化しただけである。自家製剤加算は算定できる。",
    "answer": false,
    "explanation": "一包化は自家製剤加算ではなく、一包化加算など別の評価です。剤形を変える調製とは区別します。"
  },
  {
    "category": "軟膏混合",
    "text": "医師の指示で2種類の軟膏を混合した。これは通常、自家製剤加算ではなく計量混合調剤加算の対象を検討する。",
    "answer": true,
    "explanation": "軟膏やクリームの混合は、自家製剤加算ではなく計量混合調剤加算との区別が重要です。"
  },
  {
    "category": "液剤",
    "text": "既製の液剤を単に計量して交付しただけで、自家製剤加算を算定できる。",
    "answer": false,
    "explanation": "単なる計量や分注だけでは自家製剤加算の対象ではありません。"
  },
  {
    "category": "点眼",
    "text": "市販・薬価収載されている点眼液をそのまま交付した。自家製剤加算は算定できる。",
    "answer": false,
    "explanation": "既製剤をそのまま交付するだけでは自家製剤加算は算定できません。"
  },
  {
    "category": "粉砕",
    "text": "嚥下困難の患者に対し、医師の指示で錠剤を粉砕し、同一成分で対応できる既製の散剤がない。自家製剤加算は算定できる場合がある。",
    "answer": true,
    "explanation": "医師の指示、必要性、既製剤の有無を確認したうえで算定可否を判断します。"
  },
  {
    "category": "返戻注意",
    "text": "処方せん上に粉砕指示がなく、薬歴にも医師確認の記録がないが、嚥下困難そうなので粉砕した。自家製剤加算は算定できる。",
    "answer": false,
    "explanation": "医師の指示または確認記録がない場合、返戻・査定の対象になりやすいです。"
  }
];

let current = 0;
let score = 0;
let userName = "";
let startedAt = "";
let answers = [];
let answered = false;

const $ = (id) => document.getElementById(id);

function show(id) {
  ["startScreen", "quizScreen", "finishScreen"].forEach(x => $(x).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function startQuiz() {
  userName = $("userName").value.trim();
  if (!userName) { $("nameError").classList.remove("hidden"); return; }
  $("nameError").classList.add("hidden");
  current = 0; score = 0; answers = []; answered = false; startedAt = new Date().toISOString();
  show("quizScreen");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = questions[current];
  $("progress").textContent = `${current + 1} / ${questions.length}`;
  $("scoreText").textContent = `正解 ${score}`;
  $("category").textContent = q.category;
  $("questionText").textContent = q.text;
  $("resultBox").classList.add("hidden");
  ["trueBtn", "falseBtn"].forEach(id => {
    $(id).disabled = false;
    $(id).classList.remove("correct", "wrong");
  });
}

function chooseAnswer(choice) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  const ok = choice === q.answer;
  if (ok) score++;
  answers.push({ no: current + 1, category: q.category, answer: choice ? "○" : "×", correctAnswer: q.answer ? "○" : "×", result: ok ? "正解" : "不正解" });
  $("trueBtn").disabled = true;
  $("falseBtn").disabled = true;
  const chosenBtn = choice ? $("trueBtn") : $("falseBtn");
  chosenBtn.classList.add(ok ? "correct" : "wrong");
  if (!ok) (q.answer ? $("trueBtn") : $("falseBtn")).classList.add("correct");
  $("judge").textContent = ok ? "正解！" : "不正解";
  $("explanation").textContent = q.explanation;
  $("resultBox").classList.remove("hidden");
  $("scoreText").textContent = `正解 ${score}`;
}

function nextQuestion() {
  current++;
  if (current >= questions.length) return finishQuiz();
  renderQuestion();
}

function finishQuiz() {
  const percent = Math.round(score / questions.length * 100);
  $("finalScore").textContent = `${score} / ${questions.length}問 正解（${percent}%）`;
  $("finalMessage").textContent = "最後に難易度を選んで、結果を送信してください。";
  $("sendStatus").textContent = "";
  show("finishScreen");
}

async function submitResult() {
  const difficulty = $("difficulty").value;
  if (!difficulty) { $("difficultyError").classList.remove("hidden"); return; }
  $("difficultyError").classList.add("hidden");
  const btn = $("submitBtn");
  btn.disabled = true;
  $("sendStatus").textContent = "送信中です…";
  const payload = {
    submittedAt: new Date().toISOString(), startedAt, name: userName,
    score, total: questions.length, percent: Math.round(score / questions.length * 100),
    difficulty, answers
  };
  try {
    await fetch(SUBMIT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    $("sendStatus").textContent = "送信しました。スプレッドシートを確認してください。";
  } catch(e) {
    $("sendStatus").textContent = "送信できませんでした。Apps ScriptのURLや公開設定を確認してください。";
    btn.disabled = false;
  }
}

function retry() {
  $("difficulty").value = "";
  $("userName").value = "";
  show("startScreen");
}

document.addEventListener("DOMContentLoaded", () => {
  $("startBtn").addEventListener("click", startQuiz);
  $("trueBtn").addEventListener("click", () => chooseAnswer(true));
  $("falseBtn").addEventListener("click", () => chooseAnswer(false));
  $("nextBtn").addEventListener("click", nextQuestion);
  $("submitBtn").addEventListener("click", submitResult);
  $("retryBtn").addEventListener("click", retry);
  $("userName").addEventListener("keydown", e => { if(e.key === "Enter") startQuiz(); });
});
