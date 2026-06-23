// ===== 다크모드 =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// 저장된 테마 복원
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ===== 햄버거 메뉴 =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// 메뉴 클릭 시 닫기
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// ===== 스크롤 이벤트 (헤더 + 탑버튼) =====
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // 헤더 배경 (60px 기준)
  header.classList.toggle('scrolled', y > 60);

  // 스크롤 탑 버튼 (300px 기준)
  scrollTopBtn.classList.toggle('hidden', y <= 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== 스크롤 애니메이션 (Intersection Observer) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // 한 번만 실행
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section').forEach(el => observer.observe(el));

// ===== GitHub API =====
const GITHUB_USERNAME = '본인아이디'; // ← 여기 수정
const container = document.getElementById('projects-container');

const renderProjects = async () => {
  // 로딩 상태
  container.innerHTML = '<p>로딩 중...</p>';

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const repos = await res.json();

    // 빈 상태
    if (repos.length === 0) {
      container.innerHTML = '<p>표시할 프로젝트가 없습니다.</p>';
      return;
    }

    // 성공 상태
    const cards = repos.map(({ name, description, stargazers_count, language, html_url }) => `
      <article class="project-card">
        <h3>${name}</h3>
        <p>${description ?? '설명 없음'}</p>
        <p>⭐ ${stargazers_count} &nbsp; 🔤 ${language ?? 'N/A'}</p>
        <a href="${html_url}" target="_blank" rel="noopener" class="btn btn-primary">GitHub →</a>
      </article>
    `).join('');

    container.innerHTML = `<div class="projects-grid">${cards}</div>`;

  } catch (err) {
    // 에러 상태
    container.innerHTML = `
      <p>프로젝트를 불러올 수 없습니다. (${err.message})</p>
      <button class="btn btn-secondary" id="retry-btn">다시 시도</button>
    `;
    document.getElementById('retry-btn').addEventListener('click', renderProjects);
  }
};

renderProjects();

// ===== 폼 유효성 검사 =====
const form = document.getElementById('contact-form');

const showError = (id, msg) => {
  document.getElementById(id).textContent = msg;
};
const clearError = (id) => {
  document.getElementById(id).textContent = '';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearError('name-error');
  clearError('email-error');
  clearError('message-error');

  if (!name) { showError('name-error', '이름을 입력해주세요.'); valid = false; }
  if (!email) { showError('email-error', '이메일을 입력해주세요.'); valid = false; }
  else if (!emailRegex.test(email)) { showError('email-error', '올바른 이메일 형식이 아닙니다.'); valid = false; }
  if (!message) { showError('message-error', '메시지를 입력해주세요.'); valid = false; }

  if (valid) {
    form.reset();
    const success = document.getElementById('form-success');
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 3000);
  }
});