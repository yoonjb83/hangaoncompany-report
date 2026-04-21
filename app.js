document.addEventListener('DOMContentLoaded', () => {
    // --- State & Data ---
    const appState = {
        currentPage: 'stepInfo',
        route: null,
        step: 0,
        user: { name: '', phone: '', agree1: false, agree2: false },
        results: {},
        routeA: [
            { area: '규모 및 리스크', q: '지향하시는 규모는 원장님 1인 실속형인가요, 시스템 조직형인가요?', options: ['1인 단독 진료형 (실속)', '시스템 기반 공동형 (조직)'], key: 'scale' },
            { area: '진료 환경', q: '입원실을 운영하는 대형화 모델과 외래 중심의 쾌적한 모델 중 어느 쪽을 선호하시나요?', options: ['외래 중심 효율형', '입원실 운영 성장형'], key: 'bed' },
            { area: '자본 투입', q: '초기 자본 투입 성향은 내실 중심의 안정적인 출발과 공격적인 선전 점령 중 선호하는 성향은?', options: ['실속 안정 지향', '공격적 자본 선점'], key: 'capital' },
            { area: '입지 환경', q: '안정적인 주거 밀집 지역과 역동적인 도심 상권 중 어느 곳에서의 개원을 원하시나요?', options: ['주거 밀집 (안정)', '도심/오피스 (역동)'], key: 'loc' },
            { area: '타겟 고객', q: '전 연령대 가족 단위를 타겟으로 하시나요, 아니면 직장인이나 특정 질환 타겟을 선호하시나요?', options: ['전연령 가족 중심', '직장인/특정 타겟'], key: 'target' },
            { area: '홍보 전략', q: '인근 지역의 입소문 등 밀착 마케팅을 선호하시나요, 아니면 온라인 SNS 광역 마케팅을 선호하시나요?', options: ['지역 밀착 홍보형', '온라인 SNS 광역형'], key: 'marketing' },
            { area: '수익 구조', q: '보험 진료 위주의 안정적인 수익과 비급여 특화 진료의 높은 수익성 중 어느 것을 지향하시나요?', options: ['보험/기본 진료 중심', '비급여/특화 진료 중심'], key: 'revenue' },
            { area: '진료 스타일', q: '원장님의 술기 중심 진료를 선호하시나요, 아니면 최신 장비와 시스템을 활용한 진료를 선호하시나요?', options: ['원장 술기 중심', '장비/시스템 중심'], key: 'style' },
            { area: '브랜드 가치', q: '원장님의 개성을 강조하고 싶으신가요, 아니면 네트워크의 체계적인 가치를 빌리고 싶으신가요?', options: ['개인 브랜드 강조', '네트워크 체계 지향'], key: 'brand' }
        ],
        routeB: [
            { area: 'CS', q: '전 직원이 숙지하고 실천할 수 있는 표준 환자 응대 매뉴얼을 보유하고 계십니까?', key: 'cs_1' },
            { area: 'CS', q: '원장님께서 전 직원의 서비스 교육 및 피드백을 정기적으로 점검하고 계십니까?', key: 'cs_2' },
            { area: '마케팅', q: '우리 병원 고유의 온라인 마케팅 채널을 통해 신규 환자 데이터를 확보하고 계십니까?', key: 'mark_1' },
            { area: '마케팅', q: '매달 유입되는 신규 환자의 내원 경로를 체계적으로 분석하여 전략에 반영하십니까?', key: 'mark_2' },
            { area: 'HR', q: '우수한 직원의 장기 근속을 유도하기 위한 복지 및 공정한 성과 보상 체계가 있습니까?', key: 'hr_1' },
            { area: 'HR', q: '안정적인 조직 문화가 구축되어 있으며 핵심 직원이 병원 비전에 공감하고 있습니까?', key: 'hr_2' },
            { area: '진료', q: '의료진 개인의 역량에 의존하지 않고 상향 평준화된 진료 품질을 위한 매뉴얼이 있습니까?', key: 'clinic_1' },
            { area: '진료', q: '진료실에서의 상담 결과가 실제 환자의 치료 및 수납 결정으로 효과적으로 연결되고 있습니까?', key: 'clinic_2' },
            { area: 'CRM', q: '한 번 내원한 환자가 이탈하지 않도록 정기적인 사후 관리 툴을 활발히 사용 중이십니까?', key: 'crm_1' },
            { area: 'CRM', q: 'VIP나 충성도 높은 환자를 대상으로 매출 기여도를 높이기 위한 별도 관리가 이루어집니까?', key: 'crm_2' },
            { area: '비전', q: '원장님과 전 직원이 같은 목표를 향해 나아갈 수 있는 명문화된 경영 목표가 있습니까?', key: 'vision_1' },
            { area: '비전', q: '원장님만이 가진 고유한 인술 철학이 병원의 브랜딩과 원내 분위기에 자연스럽게 녹아 있습니까?', key: 'vision_2' }
        ]
    };

    const images = {
        urban: 'hospital_persona_urban_high_end_1773995130218.png',
        neighborhood: 'hospital_persona_neighborhood_healer_1773995146325.png',
        efficiency: 'hospital_persona_efficiency_solo_1773995160677.png',
        medical: 'hospital_persona_medical_center_1773995174948.png'
    };

    // --- DOM refs ---
    const ctaBtn = document.getElementById('ctaBtn');
    const backBtn = document.getElementById('backAction');
    const progressBar = document.getElementById('progressBar');
    const labelArea = document.getElementById('labelArea');
    const txtQuestion = document.getElementById('txtQuestion');
    const dynamicOptions = document.getElementById('dynamicOptions');

    // --- Core Methods ---
    function updateNav() {
        let isValidationOk = false;

        if (appState.currentPage === 'stepInfo') {
            const nameVal = document.getElementById('inName').value.trim();
            const phoneVal = document.getElementById('inPhone').value.trim();
            const isPrivacyChecked = document.getElementById('agree1').checked;

            // Validate: Name > 1 char, Phone > 8 chars, Privacy checked
            isValidationOk = (nameVal.length >= 2 && phoneVal.length >= 10 && isPrivacyChecked);

            backBtn.style.visibility = 'hidden';
            ctaBtn.innerText = '진단 시작하기';
            ctaBtn.style.display = 'block';
        } else if (appState.currentPage === 'stepBranch') {
            isValidationOk = (appState.route !== null);
            backBtn.style.visibility = 'visible';
            ctaBtn.innerText = '선택 완료';
            ctaBtn.style.display = 'block';
        } else if (appState.currentPage === 'stepQuestion') {
            const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
            const cq = list[appState.step];
            isValidationOk = (appState.results[cq.key] !== undefined);
            backBtn.style.visibility = 'visible';
            ctaBtn.innerText = '다음 질문';
            ctaBtn.style.display = 'block';
        } else if (appState.currentPage === 'stepResult') {
            isValidationOk = true;
            ctaBtn.style.display = 'none';
            backBtn.style.visibility = 'visible';
        }

        if (isValidationOk) {
            ctaBtn.classList.add('ready');
        } else {
            ctaBtn.classList.remove('ready');
        }

        // Progress calc
        let progValue = 0;
        if (appState.currentPage === 'stepInfo') progValue = 10;
        else if (appState.currentPage === 'stepBranch') progValue = 25;
        else if (appState.currentPage === 'stepQuestion') {
            const totalSteps = appState.route === 'routeA' ? appState.routeA.length : appState.routeB.length;
            progValue = 25 + ((appState.step + 1) / totalSteps) * 70;
        } else if (appState.currentPage === 'stepResult') progValue = 100;
        progressBar.style.width = progValue + '%';
    }

    function renderView(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const el = document.getElementById(pageId);
        if (el) el.classList.add('active');
        if (pageId === 'stepQuestion') renderQuestionContent();
        updateNav();
    }

    function renderQuestionContent() {
        const list = appState.route === 'routeA' ? appState.routeA : appState.routeB;
        const cq = list[appState.step];
        labelArea.innerText = cq.area + ' 영역 (질문 ' + (appState.step + 1) + '/' + list.length + ')';
        txtQuestion.innerText = cq.q;
        dynamicOptions.innerHTML = '';

        if (appState.route === 'routeA') {
            const wrap = document.createElement('div');
            wrap.className = 'survey-options-list';
            cq.options.forEach((opt, idx) => {
                const btn = document.createElement('div');
                btn.className = 'survey-btn-option';
                if (appState.results[cq.key] === idx) btn.classList.add('selected');
                btn.innerText = opt;
                btn.onclick = () => {
                    appState.results[cq.key] = idx;
                    renderQuestionContent();
                    updateNav();
                };
                wrap.appendChild(btn);
            });
            dynamicOptions.appendChild(wrap);
        } else {
            const scaleWrap = document.createElement('div');
            scaleWrap.className = 'premium-scale-box';
            const btnWrap = document.createElement('div');
            btnWrap.className = 'rating-btns-wrap';
            for (let i = 1; i <= 5; i++) {
                const b = document.createElement('button');
                b.className = 'scale-btn';
                if (appState.results[cq.key] === i) b.classList.add('active');
                b.innerText = i;
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    appState.results[cq.key] = i;
                    renderQuestionContent();
                    updateNav();
                });
                btnWrap.appendChild(b);
            }
            scaleWrap.appendChild(btnWrap);
            scaleWrap.innerHTML += '<div class="scale-labels"><span>전혀 아니다</span><span>매우 그렇다</span></div>';
            dynamicOptions.appendChild(scaleWrap);
        }
    }

    function generateReport() {
        saveData();
        const badge = document.getElementById('resBadge'), title = document.getElementById('resTitle'), img = document.getElementById('resImg');
        const an = document.getElementById('resAn'), st = document.getElementById('resSt'), ha = document.getElementById('resHa');
        const chartBox = document.getElementById('chartView');

        if (appState.route === 'routeA') {
            chartBox.style.display = 'none';
            const loc = appState.results['loc'], proc = appState.results['style'], cap = appState.results['capital'];
            let persona = '', personaImg = '', analysis = '', strategy = '', hangaon = '';

            if (loc === 1 && proc === 1) {
                persona = '도심형 하이엔드 테크니션'; personaImg = images.urban;
                analysis = '유동 인구가 많은 도심 상권에서 첨단 의료 장비와 체계적인 시스템을 결합하여 고부가가치 진료를 추구하는 성향이 강하십니다.';
                strategy = 'SNS 마케팅을 통한 신환 유입과 효율적인 원내 동선 배치가 중요합니다. 높은 초기 고정비를 관리하기 위한 현금 흐름 확보 전략이 필요합니다.';
                hangaon = '한가온컴퍼니의 프리미엄 브랜딩과 디지털 마케팅 연계 솔루션이 원장님의 성공적인 개원을 돕습니다.';
            } else if (loc === 0 && proc === 0) {
                persona = '지역거점형 패밀리 힐러'; personaImg = images.neighborhood;
                analysis = '안정적인 주거 지역에서 환자와의 정서적 교감을 중시하며, 원장님만의 정교한 술기를 통해 지역 신뢰를 쌓고 싶어 하시는 리더십 유형이십니다.';
                strategy = '지역 맘카페 및 오프라인 커뮤니티의 신뢰 확보가 성공의 열쇠입니다. 보험 진료 수익 최적화와 친절한 데스크 응대 시스템 구축을 제안합니다.';
                hangaon = '한가온컴퍼니의 지역 밀착 입소문 마케팅과 보험 경영 컨설팅을 제공합니다.';
            } else if (cap === 1) {
                persona = '시스템 중심 메디컬 센터장'; personaImg = images.medical;
                analysis = '충분한 인프라와 체계적인 조직 운영을 통해 원장님 1인의 한계를 넘어 병원급 성장을 꿈꾸는 야심 찬 경영자 유형이십니다.';
                strategy = '조직원 간의 비전 공유와 인사 노무 리스크 관리가 핵심입니다. 규모에 맞는 재무 관리와 표준 운영 매뉴얼을 도입할 시 성장에 가속도가 붙습니다.';
                hangaon = '병의원 인사 매니지먼트 시스템과 입원 시스템 기획 패키지로 병원다운 병원을 완성해 드립니다.';
            } else {
                persona = '효율 지향 스마트 솔로 프랙티셔너'; personaImg = images.efficiency;
                analysis = '불필요한 고정비는 최소화하고 원장님만의 개성을 강조하며 효율적인 스마트 경영 툴을 활용해 실용적인 가치를 창출하는 개원을 선호하십니다.';
                strategy = '1인 특화 공간 배치를 통해 인건비를 절감하고, AI 상담 자동화 툴을 통해 원장님의 진료 집중도를 높이는 전략이 필요합니다.';
                hangaon = '컴팩트 개원 인테리어와 AI 상담 자동화 패키지로 실속 있는 경영을 지원합니다.';
            }
            badge.innerText = 'DNA 진단 결과'; title.innerText = persona; img.src = personaImg; an.innerText = analysis; st.innerText = strategy; ha.innerText = hangaon;
        } else {
            chartBox.style.display = 'block'; badge.innerText = '경영 지표 점검 완료'; title.innerText = '경영 밸런스 리포트'; img.style.display = 'none';
            const categories = ['cs', 'mark', 'hr', 'clinic', 'crm', 'vision'];
            const radarData = categories.map(c => ((appState.results[c + '_1'] || 3) + (appState.results[c + '_2'] || 3)) / 2);

            const low = categories.map((c, i) => ({ n: c, s: radarData[i] })).sort((a, b) => a.s - b.s).slice(0, 2);
            an.innerText = '현재 경영 성장의 병목 현상이 예상되는 영역은 [' + low[0].n.toUpperCase() + '] 항목입니다. 해당 지표의 보강이 병원 매출 상승의 핵심 열쇠입니다.';
            st.innerText = '현재 ' + low[0].s + '점으로 개선이 시급한 구간입니다. 한가온컴퍼니의 표준 경영 프로세스 도입을 통해 단기간에 지표 개선 효과를 볼 수 있습니다.';
            ha.innerText = '현장 상담석에서 이 데이터에 기반한 정밀 정공 로드맵을 즉시 받아보실 수 있습니다.';

            new Chart(document.getElementById('resChart'), {
                type: 'radar',
                data: { labels: categories.map(c => c.toUpperCase()), datasets: [{ data: radarData, backgroundColor: 'rgba(37,99,235,0.15)', borderColor: '#2563EB', borderWidth: 2, pointBackgroundColor: '#2563EB' }] },
                options: { scales: { r: { beginAtZero: true, max: 5, ticks: { display: false }, grid: { color: 'rgba(37,99,235,0.1)' }, pointLabels: { color: '#1E293B', font: { weight: '600' } } } }, plugins: { legend: { display: false } } }
            });
        }
    }

    function saveData() {
        try {
            const d = JSON.parse(localStorage.getItem('diag_db') || '[]');
            d.push({ id: Date.now(), user: appState.user, results: appState.results, route: appState.route, date: new Date().toISOString() });
            localStorage.setItem('diag_db', JSON.stringify(d));
        } catch (e) { console.error('Save failed', e); }
    }

    // --- Actions ---
    window.toggleLegal = (id) => {
        const c = document.getElementById(id);
        if (!c) return;
        c.checked = !c.checked;
        appState.user[id] = c.checked;
        const p = c.closest('.check-pill');
        if (c.checked) p.classList.add('checked'); else p.classList.remove('checked');
        updateNav();
    };

    window.setRoute = (r, el) => {
        appState.route = r;
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        if (el) el.classList.add('selected');
        updateNav();
    };

    ctaBtn.onclick = () => {
        if (!ctaBtn.classList.contains('ready')) {
            console.log('Button not ready. State:', appState);
            return;
        }

        if (appState.currentPage === 'stepInfo') {
            appState.user.name = document.getElementById('inName').value;
            appState.user.phone = document.getElementById('inPhone').value;
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
                updateNav();
            } else {
                appState.currentPage = 'stepResult';
                generateReport();
                renderView('stepResult');
            }
        }
    };

    backBtn.onclick = () => {
        if (appState.currentPage === 'stepBranch') {
            appState.currentPage = 'stepInfo';
            renderView('stepInfo');
        } else if (appState.currentPage === 'stepQuestion') {
            if (appState.step > 0) {
                appState.step--;
                renderQuestionContent();
                updateNav();
            } else {
                appState.currentPage = 'stepBranch';
                renderView('stepBranch');
            }
        }
    };

    // Attach input listeners
    document.getElementById('inName').addEventListener('input', updateNav);
    document.getElementById('inPhone').addEventListener('input', updateNav);

    // Initial Nav state
    updateNav();
});
