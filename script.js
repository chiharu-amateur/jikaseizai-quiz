const questions = [
  {
    text: "錠剤を半錠に割って調剤した。薬価基準に同一規格の半量規格がない場合、自家製剤加算を算定できる。",
    answer: true,
    explanation: "同一剤形・同一規格で代替できる市販品がない場合は、割錠による自家製剤加算の対象になり得ます。"
  },
  {
    text: "錠剤を粉砕したが、同一成分の散剤が薬価基準に収載されている。この場合でも自家製剤加算を算定できる。",
    answer: false,
    explanation: "同一成分・同一剤形などで代替できる薬価収載品がある場合は、原則として算定できません。"
  },
  {
    text: "カプセルを脱カプセルして粉末として調剤した。患者が嚥下困難で、医師の指示がある場合、自家製剤加算の対象になり得る。",
    answer: true,
    explanation: "医師の指示に基づき、服用上必要な加工を行い、代替可能な製剤がない場合は対象になり得ます。"
  },
  {
    text: "2種類の軟膏を混合しただけなので、必ず自家製剤加算を算定できる。",
    answer: false,
    explanation: "軟膏の混合は、内容によっては計量混合調剤加算の論点になります。自家製剤加算と混同しないよう注意が必要です。"
  },
  {
    text: "錠剤を粉砕した理由が、患者希望だけで医師の指示がない場合、自家製剤加算は算定しにくい。",
    answer: true,
    explanation: "自家製剤加算は、処方医の指示や薬学的必要性が重要です。単なる患者希望のみでは返戻リスクがあります。"
  },
  {
    text: "ドライシロップを水に溶かして交付しただけなら、自家製剤加算ではなく別の論点になる。",
    answer: true,
    explanation: "液剤化や計量混合との区別が必要です。単純な溶解だけで自家製剤加算と判断するのは危険です。"
  },
  {
    text: "自家製剤加算は、薬価基準に代替できる製剤があるかどうかの確認が重要である。",
    answer: true,
    explanation: "返戻対策として、薬価基準上の同一成分・同一剤形・規格の確認が重要です。"
  },
  {
    text: "錠剤を4分の1錠に分割した場合、同一成分の該当する少量規格が薬価基準にあれば、原則算定できない。",
    answer: true,
    explanation: "代替できる規格が存在する場合は、わざわざ自家製剤したものとしての算定は認められにくいです。"
  },
  {
    text: "散剤を単に秤量して分包しただけでも、自家製剤加算を算定できる。",
    answer: false,
    explanation: "通常の秤量・分包だけでは自家製剤加算ではありません。加工の有無がポイントです。"
  },
  {
    text: "自家製剤加算の可否は、地域や審査側の判断で差が出ることがあるため、根拠を残しておくとよい。",
    answer: true,
    explanation: "薬価基準の確認、医師指示、嚥下困難などの理由を記録しておくと返戻対策になります。"
  }
];

let current = 0;
let score = 0;
let answered = false;
const answerLog = [];

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const finishScreen = document.getElementById("finishScreen");
const progress = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const questionText = document.getElementById("questionText");
const resultBox = document.getElementById("resultBox");
const judge = document.getElementById("judge");
const explanation = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const finalScore = document.getElementById("finalScore");
const finalMessage = document.getElementById("finalMessage");
const submitForm = document.getElementById("submitForm");
const sendStatus = document.getElementById("sendStatus");

function showQuestion() {
  answered = false;
  const q = questions[current];
  progress.textContent = `${current + 1} / ${questions.length}`;
  scoreEl.textContent = `正解 ${score}`;
  questionText.textContent = q.text;
  resultBox.classList.add("hidden");
  document.querySelectorAll(".answer").forEach(btn => btn.disabled = false);
}

function finishQuiz() {
  quizScreen.classList.add("hidden");
  finishScreen.classList.remove("hidden");
  const percent = Math.round((score / questions.length) * 100);
  finalScore.textContent = `${questions.length}問中 ${score}問正解（${percent}%）`;
  finalMessage.textContent = percent >= 80 ? "かなり良い感じです！" : percent >= 60 ? "あと少しで安定しそうです。" : "解説を見ながらもう一度やってみましょう。";
}

function handleAnswer(userAnswer) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  const correct = userAnswer === q.answer;
  if (correct) score++;
  answerLog.push({
    no: current + 1,
    question: q.text,
    userAnswer: userAnswer ? "算定できる" : "算定できない",
    correctAnswer: q.answer ? "算定できる" : "算定できない",
    result: correct ? "正解" : "不正解"
  });
  judge.textContent = correct ? "正解！" : "不正解";
  explanation.textContent = q.explanation;
  resultBox.classList.remove("hidden");
  scoreEl.textContent = `正解 ${score}`;
  document.querySelectorAll(".answer").forEach(btn => btn.disabled = true);
  nextBtn.textContent = current === questions.length - 1 ? "結果を見る" : "次の問題へ";
}

async function submitResult(event) {
  event.preventDefault();

  if (!GAS_WEB_APP_URL) {
    sendStatus.textContent = "config.js にGoogle Apps ScriptのURLを設定してください。";
    return;
  }

  const payload = {
    timestamp: new Date().toLocaleString("ja-JP"),
    name: document.getElementById("playerName").value.trim(),
    difficulty: document.getElementById("difficulty").value,
    score,
    total: questions.length,
    percent: Math.round((score / questions.length) * 100),
    answers: JSON.stringify(answerLog)
  };

  sendStatus.textContent = "送信中です...";

  try {
    await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    sendStatus.textContent = "送信しました。スプレッドシートを確認してください。";
    submitForm.querySelector("button").disabled = true;
  } catch (error) {
    console.error(error);
    sendStatus.textContent = "送信に失敗しました。URLや公開設定を確認してください。";
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
});

document.querySelectorAll(".answer").forEach(btn => {
  btn.addEventListener("click", () => handleAnswer(btn.dataset.answer === "true"));
});

nextBtn.addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    finishQuiz();
  }
});

submitForm.addEventListener("submit", submitResult);

document.getElementById("retryBtn").addEventListener("click", () => location.reload());
