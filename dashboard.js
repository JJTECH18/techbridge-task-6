// TechBridge Intern Dashboard
// JavaScript used: arrays and objects, variables, functions, event listeners,
// conditional logic, filtering, progress calculations, DOM manipulation, Local Storage.

// ----- 1. Data -----
// The sample intern. Change these two values to show a different intern.
const intern = { name: 'Alex', track: 'Web Development Intern' };

// The 8 internship tasks (Web Development track). Cards are generated from this array.
const tasks = [
  { number: 1, title: 'Build the TechBridge Homepage', day: 1, difficulty: 'Beginner', status: 'Completed',
    description: 'Create the first version of the TechBridge website using HTML and CSS.',
    build: 'A first version of the TechBridge website, written in HTML and CSS.', page: 'index.html', pageLabel: 'Open the homepage' },
  { number: 2, title: 'Build the TechBridge Programs Experience', day: 4, difficulty: 'Beginner', status: 'Completed',
    description: "Create a Programs experience presenting TechBridge's available learning programs.",
    build: "A Programs experience that presents TechBridge's learning programs.", page: 'programs.html', pageLabel: 'Open the Programs page' },
  { number: 3, title: 'Build the Internship Tasks Experience', day: 8, difficulty: 'Beginner \u2192 Intermediate', status: 'Completed',
    description: 'Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.',
    build: 'An interface that lays out the internship tasks and the journey through them.', page: 'tasks.html', pageLabel: 'Open the Tasks page' },
  { number: 4, title: 'Build an Interactive Internship Roadmap', day: 11, difficulty: 'Beginner \u2192 Intermediate', status: 'In Progress',
    description: 'Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.',
    build: 'An interactive roadmap, using JavaScript, where visitors switch between the Data Analytics and Web Development tracks.', page: 'roadmap.html', pageLabel: 'Open the Roadmap' },
  { number: 5, title: 'Build the Intern Registration Experience', day: 15, difficulty: 'Intermediate', status: 'Not Started',
    description: 'Create a professional registration and onboarding interface for TechBridge interns.',
    build: 'A registration and onboarding interface for TechBridge interns.' },
  { number: 6, title: 'Build the Task Submission System', day: 19, difficulty: 'Intermediate', status: 'Not Started',
    description: 'Create an interface through which interns can prepare and submit their task work.',
    build: 'An interface where interns prepare and submit their task work.' },
  { number: 7, title: 'Build the Intern Dashboard', day: 22, difficulty: 'Intermediate', status: 'Not Started',
    description: 'Create a dashboard where an intern can view their profile, progress, tasks and submissions.',
    build: "A dashboard showing an intern's profile, progress, tasks and submissions.", page: 'dashboard.html', pageLabel: 'Open this dashboard' },
  { number: 8, title: 'Build the Complete TechBridge Internship Platform', day: 26, difficulty: 'Intermediate', status: 'Not Started',
    description: 'Combine the different components created during the internship into a complete TechBridge platform.',
    build: 'A complete TechBridge platform that combines the components from earlier tasks.' }
];
const initialStatuses = tasks.map(function (t) { return t.status; });

// Modern Web Technologies (for the Technology Explorer).
const technologies = {
  nextjs: { name: 'Next.js', tag: 'Frontend framework (React)',
    summary: 'Next.js is a React framework used for building modern, full-featured web applications. It adds routing, server-side rendering, static page generation and API routes on top of React.',
    uses: ['SEO-friendly websites and blogs', 'E-commerce stores and marketing sites', 'Dashboards and full-stack web apps'],
    link: 'https://nextjs.org' },
  vue: { name: 'Vue.js', tag: 'Frontend framework',
    summary: 'Vue.js is a progressive JavaScript framework for building user interfaces. It is component-based and known for being approachable for beginners, and you can adopt it a little at a time.',
    uses: ['Interactive user interfaces', 'Single-page applications (SPAs)', 'Adding interactivity to existing pages'],
    link: 'https://vuejs.org' },
  angular: { name: 'Angular', tag: 'Frontend framework (TypeScript)',
    summary: 'Angular is a TypeScript-based framework maintained by Google. It is a complete platform that includes routing, forms and tools for structuring large applications.',
    uses: ['Large, enterprise-style web applications', 'Admin panels and business dashboards', 'Teams that want a strict, consistent structure'],
    link: 'https://angular.dev' },
  backend: { name: 'Backend Development', tag: 'Server side',
    summary: 'Backend development is the work that happens on the server: storing data in databases, handling logins, and running the rules of an application. The frontend (what users see) sends requests to the backend, usually through an API over HTTP. The backend processes them and sends data back, often as JSON, for the frontend to display.',
    uses: ['Databases and data storage', 'User accounts and authentication', 'APIs that the frontend calls'],
    link: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps',
    tools: [
      { name: 'Node.js', text: 'A JavaScript runtime that lets you run JavaScript on the server.' },
      { name: 'Express.js', text: 'A small, popular framework for building web servers and APIs with Node.js.' },
      { name: 'Django', text: 'A full-featured Python framework with many built-in tools.' },
      { name: 'Flask', text: 'A lightweight Python framework for small apps and APIs.' },
      { name: 'Laravel', text: 'A PHP framework with clean syntax for building web applications.' },
      { name: '.NET', text: "Microsoft's cross-platform framework, commonly used with C#." }
    ] }
};

// ----- 2. Variables -----
const STORAGE_KEY = 'techbridge-dashboard-v1';
let currentFilter = 'All';
let toastTimer = null;

// ----- 3. Page elements -----
const $ = function (id) { return document.getElementById(id); };
const taskList = $('task-list');
const taskEmpty = $('task-empty');
const filterButtons = document.querySelectorAll('#task-filters .fbtn');
const techButtons = document.querySelectorAll('#tech-tabs .tab');
const dialog = $('task-dialog');

// ----- 4. Saving and loading (Local Storage, optional) -----
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.map(function (t) { return t.status; })));
  } catch (error) { /* storage unavailable: the dashboard still works */ }
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length === tasks.length) {
      saved.forEach(function (status, i) {
        if (['Completed', 'In Progress', 'Not Started'].indexOf(status) !== -1) { tasks[i].status = status; }
      });
    }
  } catch (error) { /* ignore */ }
}

// ----- 5. Calculations -----
function countStatus(status) {
  return tasks.filter(function (t) { return t.status === status; }).length;
}
function formatPercent(done, total) {
  const value = Math.round((done / total) * 1000) / 10;
  return value + '%';
}
function getCurrentTask() {
  let task = tasks.find(function (t) { return t.status === 'In Progress'; });
  if (!task) { task = tasks.find(function (t) { return t.status === 'Not Started'; }); }
  return task || null;
}
function getInternStatus(done, total) {
  if (done === total) { return 'Completed'; }
  if (done > 0 || countStatus('In Progress') > 0) { return 'In Progress'; }
  return 'Not Started';
}

// ----- 6. Rendering (DOM manipulation) -----
function updateProgress() {
  const total = tasks.length;
  const done = countStatus('Completed');
  const left = total - done;
  const percentNumber = Math.round((done / total) * 1000) / 10;

  $('done-count').textContent = done;
  $('total-count').textContent = total;
  $('left-count').textContent = left;
  $('s-total').textContent = total;
  $('s-done').textContent = done;
  $('s-left').textContent = left;
  $('pct').textContent = formatPercent(done, total);
  $('pfill').style.transform = 'scaleX(' + (done / total) + ')';
  $('pbar').setAttribute('aria-valuenow', percentNumber);

  const status = getInternStatus(done, total);
  $('intern-status').textContent = status;
  $('intern-status').setAttribute('data-s', status);
  $('celebrate').hidden = done !== total;

  const current = getCurrentTask();
  if (current) {
    $('current-title').textContent = 'Task ' + current.number + ': ' + current.title;
    $('current-desc').textContent = current.description;
    $('continue-btn').hidden = false;
    $('continue-btn').dataset.task = current.number;
  } else {
    $('current-title').textContent = 'All tasks completed';
    $('current-desc').textContent = 'You have finished every internship task.';
    $('continue-btn').hidden = true;
  }
}

function buildCard(task) {
  let buttons = '<button type="button" class="btn btn-ghost btn-sm" data-action="view" data-task="' + task.number + '">View Task</button>';
  if (task.status === 'Not Started') {
    buttons += '<button type="button" class="btn btn-ghost btn-sm" data-action="start" data-task="' + task.number + '">Start Task</button>';
  }
  if (task.status !== 'Completed') {
    buttons += '<button type="button" class="btn btn-sm" data-action="complete" data-task="' + task.number + '">Mark as Completed</button>';
  }
  return '<li class="tk" data-s="' + task.status + '" data-card="' + task.number + '">' +
    '<div class="tk-top"><span class="tnum">TASK ' + task.number + '</span><span class="st" data-s="' + task.status + '">' + task.status + '</span></div>' +
    '<h3>' + task.title + '</h3>' +
    '<p class="d">' + task.description + '</p>' +
    '<p class="meta"><span>Day ' + task.day + '</span><span>' + task.difficulty + '</span></p>' +
    '<div class="acts">' + buttons + '</div></li>';
}

function renderTasks() {
  const visible = tasks.filter(function (t) { return currentFilter === 'All' || t.status === currentFilter; });
  taskList.innerHTML = visible.map(buildCard).join('');
  taskEmpty.hidden = visible.length !== 0;

  filterButtons.forEach(function (button) {
    const name = button.dataset.filter;
    const count = name === 'All' ? tasks.length : countStatus(name);
    button.textContent = name + ' (' + count + ')';
    button.setAttribute('aria-pressed', name === currentFilter ? 'true' : 'false');
  });
}

function refresh() {
  updateProgress();
  renderTasks();
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
}

// ----- 7. Actions -----
function findTask(number) {
  return tasks.find(function (t) { return t.number === Number(number); });
}

function completeTask(number) {
  const task = findTask(number);
  if (!task || task.status === 'Completed') { return; }
  task.status = 'Completed';

  // If nothing is in progress any more, start the next task automatically.
  let next = null;
  if (countStatus('In Progress') === 0) {
    next = tasks.find(function (t) { return t.status === 'Not Started'; });
    if (next) { next.status = 'In Progress'; }
  }
  saveProgress();
  refresh();

  const card = taskList.querySelector('[data-card="' + task.number + '"]');
  if (card) { card.classList.add('flash'); }
  const done = countStatus('Completed');
  if (done === tasks.length) {
    showToast('Task ' + task.number + ' completed. All 8 tasks are done!');
  } else {
    showToast('Task ' + task.number + ' completed. ' + done + ' / ' + tasks.length + ' tasks done (' + formatPercent(done, tasks.length) + ').');
  }
  focusCard(task.number);
}

function startTask(number) {
  const task = findTask(number);
  if (!task || task.status !== 'Not Started') { return; }
  task.status = 'In Progress';
  saveProgress();
  refresh();
  showToast('Task ' + task.number + ' is now in progress.');
  focusCard(task.number);
}

function resetProgress() {
  tasks.forEach(function (t, i) { t.status = initialStatuses[i]; });
  currentFilter = 'All';
  saveProgress();
  refresh();
  showToast('Progress reset to the starting sample.');
}

// Keep keyboard focus on the card that was just used, because the list is rebuilt.
function focusCard(number) {
  const button = taskList.querySelector('[data-card="' + number + '"] [data-action="view"]');
  if (button) { button.focus({ preventScroll: true }); }
}

function openDetails(number) {
  const task = findTask(number);
  if (!task) { return; }
  const index = tasks.indexOf(task);
  const before = index > 0 ? 'Follows Task ' + tasks[index - 1].number + ' (Day ' + tasks[index - 1].day + ').' : 'The first task. The internship starts here on Day 1.';
  const after = index < tasks.length - 1 ? ' Leads into Task ' + tasks[index + 1].number + ' on Day ' + tasks[index + 1].day + '.' : ' The final task of the internship.';

  $('d-num').textContent = 'Task ' + task.number + ' \u00b7 Day ' + task.day;
  $('d-title').textContent = task.title;
  let html = '<div class="d-row"><span class="st" data-s="' + task.status + '">' + task.status + '</span><span class="tnum">' + task.difficulty + '</span></div>' +
    '<h3>What this task involves</h3><p>' + task.description + '</p>' +
    '<h3>You build</h3><p>' + task.build + '</p>' +
    '<h3>Where it fits</h3><p>' + before + after + '</p>' +
    '<div class="d-acts">';
  if (task.status !== 'Completed') {
    html += '<button type="button" class="btn" data-action="complete-close" data-task="' + task.number + '">Mark as Completed</button>';
  }
  if (task.page) {
    html += '<a class="btn btn-ghost" href="' + task.page + '">' + task.pageLabel + '</a>';
  }
  html += '</div>';
  $('d-body').innerHTML = html;
  if (typeof dialog.showModal === 'function') { dialog.showModal(); } else { dialog.setAttribute('open', ''); }
}

function closeDetails() {
  if (typeof dialog.close === 'function') { dialog.close(); } else { dialog.removeAttribute('open'); }
}

function showTechnology(key) {
  const tech = technologies[key];
  if (!tech) { return; }
  techButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.tech === key ? 'true' : 'false');
  });
  let html = '<h3>' + tech.name + '</h3><span class="tag">' + tech.tag + '</span><p>' + tech.summary + '</p>' +
    '<h4>Commonly used for</h4><ul class="use">' + tech.uses.map(function (u) { return '<li>' + u + '</li>'; }).join('') + '</ul>';
  if (tech.tools) {
    html += '<h4>Popular backend technologies</h4><ul class="bgrid">' +
      tech.tools.map(function (t) { return '<li><b>' + t.name + '</b><span>' + t.text + '</span></li>'; }).join('') + '</ul>';
  }
  html += '<a class="btn" href="' + tech.link + '" target="_blank" rel="noopener">Learn More</a>';
  const panel = $('tech-panel');
  panel.innerHTML = html;
  panel.classList.remove('swap');
  void panel.offsetWidth;
  panel.classList.add('swap');
}

// ----- 8. Event listeners -----
taskList.addEventListener('click', function (event) {
  const button = event.target.closest('[data-action]');
  if (!button) { return; }
  const number = button.dataset.task;
  if (button.dataset.action === 'view') { openDetails(number); }
  else if (button.dataset.action === 'complete') { completeTask(number); }
  else if (button.dataset.action === 'start') { startTask(number); }
});

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

techButtons.forEach(function (button) {
  button.addEventListener('click', function () { showTechnology(button.dataset.tech); });
});

$('continue-btn').addEventListener('click', function () { openDetails($('continue-btn').dataset.task); });
$('reset-btn').addEventListener('click', resetProgress);
$('d-close').addEventListener('click', closeDetails);
dialog.addEventListener('click', function (event) {
  if (event.target === dialog) { closeDetails(); return; }
  const button = event.target.closest('[data-action="complete-close"]');
  if (button) { closeDetails(); completeTask(button.dataset.task); }
});

// ----- 9. Start -----
$('welcome-title').textContent = 'Welcome back, ' + intern.name;
$('intern-track').textContent = intern.track;
$('avatar').textContent = intern.name.charAt(0).toUpperCase();
loadProgress();
refresh();
showTechnology('nextjs');
