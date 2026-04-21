document.addEventListener('DOMContentLoaded', () => {
    // --- State & Data ---
    const appState = {
        currentPage: 'stepInfo',
        route: null,
        step: 0,
        user: { name: '', phone: '' },
        results: {},
        routeA: [
            { area: '규모 및 리스크', q: '지향하시는 병원의 규모는\n어느 정도인가요?', options: ['1인 원장 중심 (실속형)', '다인 연합 시스템 (조직형)'], key: 'scale' },
            { area: '진료 환경', q: '원하시는 병원 공간의\n핵심 컨셉은 무엇인가요?', options: ['쾌적한 외래 중심형', '입원실 중심 성장형'], key: 'bed' },
            { area: '자본 투입', q: '초기 투자 및 자본 성향은\n어떠하신가요?', options: ['실속 위주 안정적 출발', '공격적 입지/선점 지향'], key: 'capital' },
            { area: '입지 환경', q: '선호하시는 개원\n후보지역은 어디인가요?', options: ['안정적인 주거 밀집지', '역동적인 도심/오피스권'], key: 'loc' },
            { area: '타겟 고객', q: '어떤 환자층을 주요\n타겟으로 삼고 싶으신가요?', options: ['전연령 가족 중심 케어', '직장인/특정 질환 전문'], key: 'target' },
            { area: '홍보 전략', q: '어떤 방식의 마케팅을\n선호하시나요?', options: ['지역 밀착 입소문 브랜딩', 'SNS/온라인 광역 마케팅'], key: 'marketing' },
            { area: '수익 구조', q: '지향하시는 주요 수익\n모델은 무엇인가요?', options: ['보험/기본 진료 중심', '비급여/특화 진료 중심'], key: 'revenue' },
            { area: '진료 스타일', q: '원장님의 진료 핵심\n강점은 무엇인가요?', options: ['정교한 술기 중심 진료', '첨단 장비와 시스템 최적화'], key: 'style' },
            { area: '브랜드 가치', q: '병원의 네이밍과 가치는\n어떤 방향인가요?', options: ['원장님 개인의 퍼스널 브랜드', '체계적인 네트워크 체인 지향'], key: 'brand' }
        ],
        routeB: [
            { area: 'CS 부문', q: '표준화된 전 직원 환자 응대\n매뉴얼을 보유 중이신가요?', key: 'cs_1' },
            { area: '마케팅 부문', q: '매월 유입되는 신규 환자의\n내원 경로를 분석하시나요?', key: 'mark_1' },
            { area: 'HR 부문', q: '직원의 장기 근속을 유도하는\n보상 체계가 존재하나요?', key: 'hr_1' },
            { area: '진료 부문', q: '의료진 개인 역량에 의존하지 않는\n표준 진료 품질 매뉴얼이 있나요?', key: 'clinic_1' },
            { area: 'CRM 부문', q: '기존 환자들의 재진을 유도하는\n정기적인 관리 툴이 있나요?', key: 'crm_1' },
            { area: '조직 부문', q: '전 직원이 공유하는 명문화된\n경영 목표가 존재하나요?', key: 'vision_1' }
        ]
    };

    const ctaBtn = document.getElementById('ctaBtn');
    const backBtn = document.getElementById('backBtn');
    const progressBar = document.getElementById('progressBar');
    const labelArea = document.getElementById('labelArea');
    const txtQuestion = document.getElementById('txtQuestion');
    const dynamicOptions = document.getElementById('dynamicOptions');

    // --- Phone & Input UX ---
    window.formatPhone = (el) => {
        let val = el.value.replace(/[^0-9]/g, '');
        if (val.length > 3 && val.length <= 7) {
            el.value = val.substring(0, 3) + '-' + val.substring(3);
        } else if (val.length > 7) {
            el.value = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
        } else {
            el.value = val;
        }
        window.updateNav();
    };

    window.checkName = (el) => {
        if (el.value.length >= 2) {
            // No auto-focus on every keystroke, but can be done if desired
        }
        window.updateNav();
    }

    // Capture "Enter" to auto-focus next on Name
    document.getElementById('inName').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('inPhone').focus();
        }
    });

    // --- Navigation & Validation ---
    window.updateNav = () => {
        let isReady = false;
        if (appState.currentPage === 'stepInfo') {
            const n = document.getElementById('inName').value.trim();
            const p = document.getElementById('inPhone').value.trim();
            const a = document.getElementById('agree1').checked;
            isReady = (n.length >= 2 && p.length >= 10 && a);
            backBtn.style.display = 'none';
            ctaBtn.innerText = '진단 시작하기';
        } else if (appState.currentPage === 'stepBranch') {
            isReady = (appState.route !== null);
            backBtn.style.display = 'block';
            ctaBtn.innerText = '다음으로';
        } else if (appState.currentPage === 'stepQuestion') {
            const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
            const q = list[appState.step];
            isReady = (appState.results[q.key] !== undefined);
            backBtn.style.display = 'block';
            ctaBtn.innerText = (appState.step === list.length - 1) ? '결과 보기' : '다음으로';
        } else {
            backBtn.style.display = 'block';
            ctaBtn.innerText = '다시 하기';
            isReady = true;
        }

        if (isReady) ctaBtn.classList.add('ready');
        else ctaBtn.classList.remove('ready');

        // Progress
        let pct = 0;
        if (appState.currentPage === 'stepInfo') pct = 10;
        else if (appState.currentPage === 'stepBranch') pct = 25;
        else if (appState.currentPage === 'stepQuestion') {
            const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
            pct = 25 + ((appState.step + 1) / list.length) * 70;
        } else pct = 100;
        progressBar.style.width = pct + '%';
    };

    window.toggleLegal = (id) => {
        const c = document.getElementById(id);
        c.checked = !c.checked;
        const p = c.closest('.f-check');
        if (c.checked) p.classList.add('checked'); else p.classList.remove('checked');
        window.updateNav();
    };

    window.setRoute = (r) => {
        appState.route = r;
        document.querySelectorAll('#stepBranch .card').forEach(c => c.classList.remove('selected'));
        const el = event ? (event.currentTarget || event.target.closest('.card')) : null;
        if (el) el.classList.add('selected');
        window.updateNav();
        // Option chosen? Wait for click or auto-move
    };

    window.nextAction = () => {
        if (!ctaBtn.classList.contains('ready')) return;

        if (appState.currentPage === 'stepInfo') {
            appState.currentPage = 'stepBranch';
            renderView('stepBranch');
        } else if (appState.currentPage === 'stepBranch') {
            appState.currentPage = 'stepQuestion';
            appState.step = 0;
            renderView('stepQuestion');
        } else if (appState.currentPage === 'stepQuestion') {
            const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
            if (appState.step < list.length - 1) {
                appState.step++;
                renderQuestionContent();
            } else {
                appState.currentPage = 'stepResult';
                renderView('stepResult');
            }
        } else if (appState.currentPage === 'stepResult') {
            location.reload();
        }
    };

    window.goBack = () => {
        if (appState.currentPage === 'stepBranch') {
            appState.currentPage = 'stepInfo';
            renderView('stepInfo');
        } else if (appState.currentPage === 'stepQuestion') {
            if (appState.step > 0) {
                appState.step--;
                renderQuestionContent();
            } else {
                appState.currentPage = 'stepBranch';
                renderView('stepBranch');
            }
        } else if (appState.currentPage === 'stepResult') {
            appState.currentPage = 'stepQuestion';
            renderView('stepQuestion');
        }
        window.scrollTo(0, 0);
    };

    function renderView(pid) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pid).classList.add('active');
        if (pid === 'stepQuestion') renderQuestionContent();
        else if (pid === 'stepResult') renderResult();
        window.updateNav();
    }

    function renderQuestionContent() {
        const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
        const cq = list[appState.step];
        labelArea.innerText = cq.area + ' 영역 (질문 ' + (appState.step + 1) + '/' + list.length + ')';
        txtQuestion.innerText = cq.q;
        dynamicOptions.innerHTML = '';

        if (appState.route === 'routeA') {
            cq.options.forEach((opt, idx) => {
                const c = document.createElement('div');
                c.className = 'card' + (appState.results[cq.key] === idx ? ' selected' : '');
                c.innerHTML = `<h3>${opt}</h3><p>전략 옵션 ${idx + 1}</p>`;
                c.onclick = () => {
                    appState.results[cq.key] = idx;
                    document.querySelectorAll('#stepQuestion .card').forEach(cd => cd.classList.remove('selected'));
                    c.classList.add('selected');
                    window.updateNav();
                };
                dynamicOptions.appendChild(c);
            });
        } else {
            const scales = [
                { v: 5, t: '매우 그렇다', e: 'fas fa-laugh-beam' },
                { v: 4, t: '그렇다', e: 'fas fa-smile' },
                { v: 3, t: '보통이다', e: 'fas fa-meh' },
                { v: 2, t: '아니다', e: 'fas fa-frown' },
                { v: 1, t: '매우 아니다', e: 'fas fa-angry' }
            ];
            scales.forEach(s => {
                const c = document.createElement('div');
                c.className = 'card' + (appState.results[cq.key] === s.v ? ' selected' : '');
                c.innerHTML = `<i class="${s.e}"></i><div class="txt"><h3>${s.t}</h3><p>${s.v >= 4 ? '우수' : (s.v <= 2 ? '보완 필요' : '보통')}</p></div>`;
                c.onclick = () => {
                    appState.results[cq.key] = s.v;
                    document.querySelectorAll('#stepQuestion .card').forEach(cd => cd.classList.remove('selected'));
                    c.classList.add('selected');
                    window.updateNav();
                };
                dynamicOptions.appendChild(c);
            });
        }
    }

    function renderResult() {
        const d = document.getElementById('stepResult');
        d.innerHTML = `
            <div class="res-card">
                <span class="l-badge">진단 완료 리포트</span>
                <h1>경영 최적화 분석</h1>
                <p class="desc" style="text-align:left;">
                    원장님의 응답을 기반으로 한 자문 의견입니다.<br><br>
                    하단의 '다시 하기'를 누르시면 처음 단계로 이동합니다. 현장의 전문 컨설턴트에게 리포트 결과를 공유해 주세요.
                </p>
            </div>
        `;
    }

    window.updateNav();
});
