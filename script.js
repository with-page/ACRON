let characters = [];
let currentType = 'all';
let currentRank = 'all';
let searchQuery = '';

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

// 2. 화면에 카드 렌더링하기 (등급 높은 순 정렬 포함)
function renderCharacters() {
    grid.innerHTML = '';
    
    // [등급 정렬 기준]: 상단부터 배치될 순서 고정
    const rankOrder = ['SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F'];
    
    // 필터 및 검색 조건 매칭
    let filtered = characters.filter(char => {
        const matchesType = (currentType === 'all' || char.type === currentType);
        const matchesRank = (currentRank === 'all' || char.rank === currentRank);
        const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesRank && matchesSearch;
    });

    // 상위 등급(SS) 요원부터 우선 정렬
    filtered.sort((a, b) => {
        return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
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
        card.addEventListener('click', () => openModal(char));
        grid.appendChild(card);
    });
}

// 3. 모달창 제어 (나이, 작위 데이터 매핑 및 // 줄바꿈 변환)
function openModal(char) {
    document.getElementById('modal-img').src = char.image;
    document.getElementById('modal-name').textContent = char.name;
    
    const badge = document.getElementById('modal-badge');
    badge.textContent = `${char.rank} · ${char.type}`;
    badge.setAttribute('data-rank', char.rank);
    
    // 📌 [나이 및 작위 데이터 연동 구역]
    document.getElementById('modal-age').textContent = char.age ? char.age : '-';
    document.getElementById('modal-title').textContent = char.title ? char.title : '-';
    
    document.getElementById('modal-ability').textContent = char.ability;
    
    // // 를 <br>로 치환하여 화면에 줄바꿈 형태로 출력
    const formattedDesc = char.description.split('//').join('<br>');
    document.getElementById('modal-desc').innerHTML = formattedDesc;
    
    modal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('active');
});

// 4. 이벤트 연동
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCharacters();
});

document.getElementById('type-filters').addEventListener('click', (e) => {
    if(!e.target.classList.contains('btn')) return;
    document.querySelectorAll('#type-filters .btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentType = e.target.getAttribute('data-filter');
    renderCharacters();
});

document.getElementById('rank-filters').addEventListener('click', (e) => {
    if(!e.target.classList.contains('btn')) return;
    document.querySelectorAll('#rank-filters .btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRank = e.target.getAttribute('data-rank');
    renderCharacters();
});

loadCharacters();
