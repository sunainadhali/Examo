const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const fmtDate = (d) => new Date(d + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const STORE_KEY = "examdesk-v1";
const seed = {
  students: [
    { roll: "1001", name: "Aarav Sharma", cls: "10-A", dob: "2010-04-12" },
    { roll: "1002", name: "Priya Nair", cls: "10-A", dob: "2010-08-03" },
    { roll: "1003", name: "Rohan Mehta", cls: "10-A", dob: "2009-12-21" },
    { roll: "1004", name: "Sara Khan", cls: "10-A", dob: "2010-02-15" },
    { roll: "1005", name: "Dev Patel", cls: "10-A", dob: "2010-06-30" },
  ],
  exams: [
    { id: "e1", name: "Unit Test 1", subject: "Mathematics", date: "2026-09-10", max: 50, pass: 18, published: true },
    { id: "e2", name: "Unit Test 1", subject: "Science", date: "2026-09-12", max: 50, pass: 18, published: true },
    { id: "e3", name: "Mid-Term", subject: "English", date: "2026-10-20", max: 100, pass: 35, published: false },
  ],
  marks: {
    e1: { 1001: 44, 1002: 48, 1003: 15, 1004: 39, 1005: 31 },
    e2: { 1001: 41, 1002: 45, 1003: 22, 1004: 36, 1005: 28 },
    e3: { 1001: 82, 1002: 91 },
  },
};
let db;
try { db = JSON.parse(localStorage.getItem(STORE_KEY)) || structuredClone(seed); } catch { db = structuredClone(seed); }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch {} };

function grade(score, exam) {
  const p = (score / exam.max) * 100;
  if (score < exam.pass) return "F";
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  return "D";
}
const statusPill = (score, exam) =>
  score == null ? '<span class="pill draft">Absent</span>'
  : score >= exam.pass ? '<span class="pill pass">Pass</span>' : '<span class="pill fail">Fail</span>';

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

/* Role switching */
function setRole(role) {
  $("#roleTeacher").setAttribute("aria-selected", role === "teacher");
  $("#roleStudent").setAttribute("aria-selected", role === "student");
  $("#teacherView").hidden = role !== "teacher";
  $("#studentView").hidden = role !== "student";
}
$("#roleTeacher").onclick = () => setRole("teacher");
$("#roleStudent").onclick = () => setRole("student");

/* Teacher auth */
$("#loginForm").onsubmit = (e) => {
  e.preventDefault();
  if ($("#pin").value === "1234") {
    $("#teacherLogin").hidden = true; $("#teacherPanel").hidden = false; $("#loginErr").hidden = true;
    renderTeacher();
  } else $("#loginErr").hidden = false;
};
$("#logout").onclick = () => { $("#teacherLogin").hidden = false; $("#teacherPanel").hidden = true; $("#pin").value = ""; };

/* Teacher tabs */
document.querySelectorAll(".tabs button").forEach((b) => b.onclick = () => {
  document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
  document.querySelectorAll("[data-panel]").forEach((p) => p.hidden = p.dataset.panel !== b.dataset.tab);
});

function renderTeacher() { renderOverview(); renderExamSelect(); renderMarks(); renderExams(); renderStudents(); }

function renderOverview() {
  const published = db.exams.filter((e) => e.published).length;
  $("#overview").innerHTML = `
    <div class="stat"><b>${db.students.length}</b><span>Students</span></div>
    <div class="stat"><b>${db.exams.length}</b><span>Exams</span></div>
    <div class="stat"><b>${published}</b><span>Results published</span></div>
    <div class="stat"><b>${db.exams.length - published}</b><span>Drafts</span></div>`;
}

function renderExamSelect() {
  const sel = $("#markExam"), prev = sel.value;
  sel.innerHTML = db.exams.map((e) => `<option value="${e.id}">${esc(e.name)} — ${esc(e.subject)}</option>`).join("");
  if (db.exams.some((e) => e.id === prev)) sel.value = prev;
}
$("#markExam").onchange = renderMarks;

function renderMarks() {
  const exam = db.exams.find((e) => e.id === $("#markExam").value);
  const body = $("#marksBody");
  if (!exam) { body.innerHTML = '<tr><td colspan="5" class="empty">Create an exam first.</td></tr>'; $("#examStats").innerHTML = ""; return; }
  if (!db.students.length) { body.innerHTML = '<tr><td colspan="5" class="empty">Add students first.</td></tr>'; return; }
  const m = db.marks[exam.id] || {};
  body.innerHTML = db.students.map((s) => {
    const v = m[s.roll];
    return `<tr data-roll="${esc(s.roll)}">
      <td>${esc(s.roll)}</td><td>${esc(s.name)}</td>
      <td><label class="sr-only" for="m-${esc(s.roll)}">Marks for ${esc(s.name)}</label>
        <input id="m-${esc(s.roll)}" type="number" min="0" max="${exam.max}" step="0.5" value="${v ?? ""}" placeholder="— / ${exam.max}"></td>
      <td class="g">${v == null ? "—" : grade(v, exam)}</td><td class="st">${statusPill(v, exam)}</td></tr>`;
  }).join("");
  body.querySelectorAll("input").forEach((inp) => inp.oninput = () => {
    const tr = inp.closest("tr"), n = inp.value === "" ? null : Number(inp.value);
    const bad = n != null && (n < 0 || n > exam.max);
    inp.style.borderColor = bad ? "var(--fail)" : "";
    tr.querySelector(".g").textContent = n == null || bad ? "—" : grade(n, exam);
    tr.querySelector(".st").innerHTML = bad ? '<span class="pill fail">Invalid</span>' : statusPill(n, exam);
  });
  renderExamStats(exam);
}

function renderExamStats(exam) {
  const vals = Object.values(db.marks[exam.id] || {});
  const passed = vals.filter((v) => v >= exam.pass).length;
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  $("#examStats").innerHTML = `
    <div class="stat"><b>${vals.length}/${db.students.length}</b><span>Marks entered</span></div>
    <div class="stat"><b>${avg}</b><span>Class average</span></div>
    <div class="stat"><b>${vals.length ? Math.max(...vals) : "—"}</b><span>Highest</span></div>
    <div class="stat"><b>${vals.length ? Math.round((passed / vals.length) * 100) + "%" : "—"}</b><span>Pass rate</span></div>`;
}

$("#saveMarks").onclick = () => {
  const exam = db.exams.find((e) => e.id === $("#markExam").value);
  if (!exam) return;
  const next = {};
  for (const tr of $("#marksBody").querySelectorAll("tr[data-roll]")) {
    const raw = tr.querySelector("input").value;
    if (raw === "") continue;
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0 || n > exam.max) { toast(`Marks must be between 0 and ${exam.max}`); tr.querySelector("input").focus(); return; }
    next[tr.dataset.roll] = n;
  }
  db.marks[exam.id] = next; save(); renderExamStats(exam); toast("Marks saved");
};

function renderExams() {
  const body = $("#examsBody");
  if (!db.exams.length) { body.innerHTML = '<tr><td colspan="6" class="empty">No exams yet.</td></tr>'; return; }
  body.innerHTML = [...db.exams].sort((a, b) => b.date.localeCompare(a.date)).map((e) => `
    <tr><td><b>${esc(e.name)}</b></td><td>${esc(e.subject)}</td><td>${fmtDate(e.date)}</td><td>${e.max} / ${e.pass}</td>
    <td><label class="switch"><input type="checkbox" data-pub="${e.id}" ${e.published ? "checked" : ""}>
      <span class="pill ${e.published ? "live" : "draft"}">${e.published ? "Published" : "Draft"}</span></label></td>
    <td><button class="btn danger sm" data-del-exam="${e.id}" aria-label="Delete ${esc(e.name)} ${esc(e.subject)}">Delete</button></td></tr>`).join("");
  body.querySelectorAll("[data-pub]").forEach((c) => c.onchange = () => {
    db.exams.find((e) => e.id === c.dataset.pub).published = c.checked; save(); renderExams(); renderOverview();
    toast(c.checked ? "Results published to students" : "Results hidden from students");
  });
  body.querySelectorAll("[data-del-exam]").forEach((b) => b.onclick = () => {
    if (!confirm("Delete this exam and all its marks?")) return;
    db.exams = db.exams.filter((e) => e.id !== b.dataset.delExam); delete db.marks[b.dataset.delExam];
    save(); renderTeacher(); toast("Exam deleted");
  });
}

$("#examForm").onsubmit = (e) => {
  e.preventDefault();
  const f = new FormData(e.target), max = Number(f.get("max")), pass = Number(f.get("pass"));
  if (pass > max) { toast("Pass marks can't exceed max marks"); return; }
  const exam = { id: uid(), name: f.get("name").trim(), subject: f.get("subject").trim(), date: f.get("date"), max, pass, published: false };
  db.exams.push(exam); save(); e.target.reset(); renderTeacher(); $("#markExam").value = exam.id; renderMarks();
  toast("Exam created");
};

function renderStudents() {
  const body = $("#studentsBody");
  if (!db.students.length) { body.innerHTML = '<tr><td colspan="5" class="empty">No students yet.</td></tr>'; return; }
  body.innerHTML = db.students.map((s) => `
    <tr><td>${esc(s.roll)}</td><td>${esc(s.name)}</td><td>${esc(s.cls)}</td><td>${fmtDate(s.dob)}</td>
    <td><button class="btn danger sm" data-del-st="${esc(s.roll)}" aria-label="Remove ${esc(s.name)}">Remove</button></td></tr>`).join("");
  body.querySelectorAll("[data-del-st]").forEach((b) => b.onclick = () => {
    if (!confirm("Remove this student?")) return;
    db.students = db.students.filter((s) => s.roll !== b.dataset.delSt);
    Object.values(db.marks).forEach((m) => delete m[b.dataset.delSt]);
    save(); renderTeacher(); toast("Student removed");
  });
}

$("#studentForm").onsubmit = (e) => {
  e.preventDefault();
  const f = new FormData(e.target), roll = f.get("roll").trim(), err = $("#studentErr");
  if (db.students.some((s) => s.roll === roll)) { err.textContent = "That roll number already exists."; err.hidden = false; return; }
  err.hidden = true;
  db.students.push({ roll, name: f.get("name").trim(), cls: f.get("cls").trim(), dob: f.get("dob") });
  db.students.sort((a, b) => a.roll.localeCompare(b.roll, undefined, { numeric: true }));
  save(); e.target.reset(); renderTeacher(); toast("Student added");
};

/* Student results */
$("#resultForm").onsubmit = (e) => {
  e.preventDefault();
  const s = db.students.find((x) => x.roll === $("#sRoll").value.trim() && x.dob === $("#sDob").value);
  if (!s) { $("#resultErr").hidden = false; return; }
  $("#resultErr").hidden = true; showResults(s);
};
$("#printResults").onclick = () => window.print();
$("#sBack").onclick = () => { $("#studentResult").hidden = true; $("#studentLogin").hidden = false; $("#resultForm").reset(); };

function showResults(s) {
  $("#studentLogin").hidden = true; $("#studentResult").hidden = false;
  $("#sName").textContent = s.name;
  $("#sMeta").textContent = `Roll ${s.roll} · Class ${s.cls}`;
  const rows = db.exams.filter((e) => e.published).sort((a, b) => b.date.localeCompare(a.date));
  let got = 0, total = 0, passed = 0, taken = 0;
  $("#sBody").innerHTML = rows.length ? rows.map((e) => {
    const v = (db.marks[e.id] || {})[s.roll];
    if (v != null) { got += v; total += e.max; taken++; if (v >= e.pass) passed++; }
    return `<tr><td><b>${esc(e.name)}</b></td><td>${esc(e.subject)}</td><td>${fmtDate(e.date)}</td>
      <td>${v == null ? "—" : `${v} / ${e.max}`}</td><td>${v == null ? "—" : ((v / e.max) * 100).toFixed(1)}</td>
      <td>${v == null ? "—" : `<b>${grade(v, e)}</b>`}</td><td>${statusPill(v, e)}</td></tr>`;
  }).join("") : '<tr><td colspan="7" class="empty">No results have been published yet. Check back later.</td></tr>';
  const pct = total ? ((got / total) * 100).toFixed(1) + "%" : "—";
  $("#sStats").innerHTML = `
    <div class="stat"><b>${pct}</b><span>Overall percentage</span></div>
    <div class="stat"><b>${got} / ${total || "—"}</b><span>Total marks</span></div>
    <div class="stat"><b>${passed}/${taken}</b><span>Exams passed</span></div>
    <div class="stat"><b>${taken && passed === taken ? '<span class="result-pass">Pass</span>' : taken ? '<span class="result-needs-work">Needs work</span>' : "—"}</b><span>Result</span></div>`;
}
