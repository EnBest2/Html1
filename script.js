let level = 1;
let xp = 0;
let xpMax = 50;
let currentLesson = 0;

function updateStatus() {
  document.getElementById('level').textContent = level;
  document.getElementById('xp').textContent = xp;
  document.getElementById('xp-max').textContent = xpMax;
  document.getElementById('xp-bar').style.width = (xp / xpMax * 100) + "%";
}

function gainXP(amount) {
  xp += amount;
  if (xp >= xpMax) {
    xp -= xpMax;
    level++;
    xpMax = Math.floor(xpMax * 1.5);
  }
  updateStatus();
}

function showLesson(index) {
  document.querySelectorAll('.lesson').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  currentLesson = index;
}

document.addEventListener('DOMContentLoaded', () => {
  updateStatus();
  showLesson(0);

  document.querySelectorAll('.lesson').forEach((lesson, index) => {
    const textarea = lesson.querySelector('.editor');
    const preview = lesson.querySelector('.preview');
    const checkBtn = lesson.querySelector('.checkBtn');
    const downloadBtn = lesson.querySelector('.downloadBtn');
    const nextBtn = lesson.querySelector('.nextBtn');
    const xpReward = parseInt(lesson.getAttribute('data-xp'));

    textarea.addEventListener('input', () => {
      preview.srcdoc = textarea.value;
    });
    preview.srcdoc = textarea.value;

    checkBtn.addEventListener('click', () => {
      const val = textarea.value.toLowerCase();
      let passed = false;
      if (index === 0) passed = val.includes("<h1>") && val.includes("<p>");
      if (index === 1) passed = (val.match(/<a/g) || []).length >= 3;
      if (index === 2) passed = (val.match(/<img/g) || []).length >= 2;
      if (index === 3) passed = val.includes("<ul>") && (val.match(/<li/g) || []).length >= 2;
      if (index === 4) passed = val.includes("<form>") && val.includes("<input") && val.includes("<button");

      if (passed) {
        gainXP(xpReward);
        alert("Sikeres megoldás! XP jóváírva.");
        nextBtn.disabled = false;
      } else {
        alert("A megoldás nem megfelelő. Próbáld újra.");
      }
    });

    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([textarea.value], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `projekt${index + 1}.html`;
      a.click();
    });

    nextBtn.addEventListener('click', () => {
      if (index + 1 < document.querySelectorAll('.lesson').length) {
        showLesson(index + 1);
      }
    });
  });
});
