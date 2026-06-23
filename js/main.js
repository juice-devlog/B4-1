// ===== 다크모드 =====
const themeToggle = document.getElementById('theme-toggle'); // id로 'theme-toggle'을 찾아 변수에 저장
const html = document.documentElement; // <html> 태그 자체를 의미

// 저장된 테마 복원
const savedTheme = localStorage.getItem('theme') || 'light'; // 이전에 저장된 테마 값(없으면 light 적용)
html.setAttribute('data-theme', savedTheme); // <html data-theme="light"> 이런 식으로 속성 세팅
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙'; // 삼항연산자. dark이면 해, light이면 달

themeToggle.addEventListener('click', () => { // 버튼 클릭 시 실행할 함수
  const isDark = html.getAttribute('data-theme') === 'dark'; // 'data-theme' 속성 값이 'dark'인지 확인
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next); // 새로고침 후에도 유지되도록 상태 저장
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ===== 햄버거 메뉴 =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// classList.toggle('active') — active 클래스가 없으면 추가, 있으면 제거. CSS에서 .nav-menu.active { display: flex; } 로 메뉴를 보이게 함
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// 메뉴 클릭 시 닫기
// querySelectorAll('a'): nav 안의 모든 <a> 태그를 배열처럼 반환
// forEach: 배열을 순회하며 각각에 이벤트 등록
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// ===== 스크롤 이벤트 (헤더 + 탑버튼) =====
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY; // 현재 스크롤 위치

  // 헤더 배경: 60px 넘으면 배경 추가
  header.classList.toggle('scrolled', y > 60);

  // 스크롤 탑 버튼: 300px 넘으면 버튼 추가
  scrollTopBtn.classList.toggle('hidden', y <= 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // 맨 위로 부드럽게 스크롤
});

// ===== 스크롤 애니메이션 (Intersection Observer) =====
const observer = new IntersectionObserver((entries) => { // 요소가 화면에 들어왔는지 감지
  entries.forEach(entry => {
    if (entry.isIntersecting) { // 요소가 화면 안에 들어왔으면
      entry.target.classList.add('visible'); // CSS의 hidden → visible 전환
    }
  });
}, { threshold: 0.2 }); // Intersection Observer 임계값 0.2 기준으로 감지된 것으로 봄

document.querySelectorAll('.section').forEach(el => observer.observe(el));

// ===== GitHub API =====
const GITHUB_USERNAME = 'juice-devlog';
const container = document.getElementById('projects-container');

const renderProjects = async () => { // async: 함수 안에서 await 사용 가능하게 함
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
    const cards = repos.map(({ name, language, html_url }) => `
      <article class="project-card">
        <h3>${name}</h3>
        <p>${language}</p>
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
  document.getElementById(id).innerHTML = msg;
};
const clearError = (id) => {
  document.getElementById(id).innerHTML = '';
};

form.addEventListener('submit', (e) => { // 폼 전송 버튼 클릭 시 실행
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearError('name-error');
  clearError('email-error');
  clearError('message-error');

  // 유효한 값이 아닌 경우 에러 메세지 출력
  // name, email, message: 비어있는 경우 유효하지 않음
  // email: 패턴이 유효하지 않은 경우도 처리
  if (!name) { showError('name-error', '이름을 입력해주세요.'); valid = false; }
  if (!email) { showError('email-error', '이메일을 입력해주세요.'); valid = false; }
  else if (!emailRegex.test(email)) { showError('email-error', '올바른 이메일 형식이 아닙니다.'); valid = false; }
  if (!message) { showError('message-error', '메시지를 입력해주세요.'); valid = false; }

  if (valid) { // 유효한 값 전송 성공 시
    form.reset(); // 폼 입력값 전체 초기화
    const success = document.getElementById('form-success');
    success.classList.remove('hidden');
    //setTimeout(() => success.classList.add('hidden'), 3000);
  }
});