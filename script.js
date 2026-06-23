let characters = [];
let currentType = 'all';
let currentRank = 'all';
let searchQuery = '';

// DOM 요소 가져오기
const grid = document.getElementById('character-grid');
const totalCount = document.getElementById('total-count');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('detail-modal');
const closeModalBtn = document.getElementById('close-modal');

// 1. JSON 데이터 불러오기
async function loadCharacters() {
    try {
        const response = await fetch('data.json');
        characters = await response.json();
        renderCharacters();
    } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
    }
}

// 2. 화면에 카드 렌더링하기
function renderCharacters() {
    grid.innerHTML = '';
    
    // 필터 및 검색어 필터링
    const filtered = characters.filter(char => {
        const matchesType = (currentType === 'all' || char.type === currentType);
        const matchesRank = (currentRank === 'all' || char.rank === currentRank);
        const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesRank && matchesSearch;
    });

    totalCount.textContent = filtered.length;

    if(filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#7c5829; padding: 40px 0;">검색 결과와 일치하는 요원이 없습니다.</p>`;
        return;
    }

    filtered.forEach(char => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}">
            <div class="card-info">
                <h3>${char.name}</h3>
                <span class="rank" data-rank="${char.rank}">${char.rank} · ${char.type}</span>
            </div>
        `;
        // 카드 클릭 이벤트 추가 (상세 모달 켜기)
        card.addEventListener('click', () => openModal(char));
        grid.appendChild(card);
    });
}

// 3. 모달창 열기 / 닫기
function openModal(char) {
    document.getElementById('modal-img').src = char.image;
    document.getElementById('modal-name').textContent = char.name;
    
    const badge = document.getElementById('modal-badge');
    badge.textContent = `${char.rank} · ${char.type}`;
    badge.setAttribute('data-rank', char.rank);
    
    document.getElementById('modal-ability').textContent = char.ability;
    document.getElementById('modal-desc').textContent = char.description;
    
    modal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

// 모달 바깥 어두운 배경 눌러도 뒤로가지게 설정
modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('active');
});

// 4. 이벤트 리스너 세팅 (검색 & 필터)
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCharacters();
});

// 타입 필터 (전체 / 센티넬 / 가이드)
document.getElementById('type-filters').addEventListener('click', (e) => {
    if(!e.target.classList.contains('btn')) return;
    document.querySelectorAll('#type-filters .btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentType = e.target.getAttribute('data-filter');
    renderCharacters();
});

// 랭크 필터 (ALL / SS ~ F)
document.getElementById('rank-filters').addEventListener('click', (e) => {
    if(!e.target.classList.contains('btn')) return;
    document.querySelectorAll('#rank-filters .btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRank = e.target.getAttribute('data-rank');
    renderCharacters();
});

// 실행
loadCharacters();
