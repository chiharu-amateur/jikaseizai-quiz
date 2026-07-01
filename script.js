const questions = [
  {
    text: "錠剤を半錠に割って調剤した。薬価基準に同一規格の半量規格がない場合、自家製剤加算を算定できるか。",
    answer: true,
    explanation: "同一剤形・同一規格で代替できる市販品がない場合は、割錠による自家製剤加算の対象になり得ます。"
  },
  {
    text: "錠剤を粉砕したが、同一成分の散剤が薬価基準に収載されている。この場合、自家製剤加算を算定できるか。",
    answer: false,
    explanation: "同一成分・同一剤形などで代替できる薬価収載品がある場合は、原則として算定できません。"
  },
  {
    text: "カプセルを脱カプセルして粉末として調剤した。患者が嚥下困難で、医師の指示がある場合、自家製剤加算を算定できるか。",
    answer: true,
    explanation: "医師の指示に基づき、服用上必要な加工を行い、代替可能な製剤がない場合は対象になり得ます。"
  },
  {
    text: "2種類の軟膏を混合した。自家製剤加算を算定できるか。",
    answer: false,
    explanation: "軟膏の混合は、計量混合調剤加算となります。自家製剤加算と混同しないよう注意が必要です。"
  },
  {
    text: "錠剤を粉砕した理由が、患者希望だけで医師の指示がない場合、自家製剤加算を算定できる。",
    answer: false,
    explanation: "自家製剤加算を算定する場合は、処方医の指示が必要です。"
  },
  {
    text: "ドライシロップを水に溶かして交付した場合、自家製剤加算を算定できるか。",
    answer: false,
    explanation: "自家製剤加算は算定できません。※調整料は水剤扱いとなります。"
  },
  {
    text: "散剤が供給不足により手に入らない為、錠剤を粉砕した。この場合、自家製剤加算を算定できるか。",
    answer: true,
    explanation: "供給上の問題により当該医薬品が入手困難であり、調剤を行う際に必要な数量を確保できない場合は算定可能です。"
  },
  {
    text: "錠剤を半錠にし、他の薬と一緒に一包化をした為、外来服薬支援料2を算定した。この場合、半錠にした薬は自家製剤加算を算定できるか。",
    answer: false,
    explanation: "外来服薬支援料2を算定した範囲の薬剤については、自家製剤加算は算定できない。"
  },
  {
    text: "実際に調べて下さい。「マグミット330㎎3錠　分3毎食後」医師の指示により粉砕。自家製剤加算を算定できるか。",
    answer: false,
    explanation: "マグミットには散剤が薬価収載されているので、自家製剤加算は算定できない"
  },
  {
    text: "実際に調べて下さい。「プレドニン錠5㎎　0.5錠　分1朝食後」を調剤。自家製剤加算を算定できるか。",
    answer: false,
    explanation: "プレドニンの一般名（プレドニゾロン）を検索すると2.5㎎のものが確認出来るので、自家製剤加算を算定できない"
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
