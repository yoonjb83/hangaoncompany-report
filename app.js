// v1.1.4 - 2026-04-21 18:48
window.onerror = function (msg, url, line) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = 'Err: ' + msg + ' (L' + line + ')';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 5000);
  }
  return false;
};

const state = {
  name: '', phone: '', email: '',
  consent1: false, consent2: false,
  route: null,
  answers: [],
  currentQ: 0,
  bMetrics: { revenue: '', visitors: '', goal: '' }
};

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx7HO4zQvne15bjH6t257xRc6e0QR68u6phGGoRNIjMFf2YQNKN65EC91LOAX982N03/exec';

// ─────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────
const questionsA = [
  {
    area: '규모 · 시설', num: '1 / 9', text: '개원 시 계획하고 계신 의원 규모는 어느 정도입니까?', type: 'choice', options: [
      { label: '소형 (1~2진료실)', desc: '집중 진료, 초기 비용 최소화 지향', val: 'S' },
      { label: '중형 (3~4진료실)', desc: '균형 잡힌 운영, 성장 가능성 확보', val: 'M' },
      { label: '대형 (5진료실 이상)', desc: '복합 센터형, 높은 초기 투자 감수', val: 'L' },
    ]
  },
  {
    area: '규모 · 시설', num: '2 / 9', text: '입원실 운영에 대한 의지는 어느 정도입니까?', type: 'choice', options: [
      { label: '운영 계획 없음', val: 'no' },
      { label: '향후 확장 시 고려', val: 'maybe' },
      { label: '처음부터 포함', val: 'yes' },
    ]
  },
  {
    area: '규모 · 시설', num: '3 / 9', text: '인테리어 및 브랜드 시설 투자 성향은?', type: 'choice', options: [
      { label: '실속/최소 투자', desc: '기능 위주, 가성비 공간 선호', val: 'low' },
      { label: '표준/안정 투자', desc: '품질과 비용의 균형', val: 'mid' },
      { label: '하이엔드/프리미엄', desc: '공간 자체가 브랜드 가치', val: 'high' },
    ]
  },
  {
    area: '입지 · 타겟', num: '4 / 9', text: '선호하는 개원 상권 유형은?', type: 'choice', options: [
      { label: '주거 밀집 (아파트)', val: 'residential' },
      { label: '도심 / 역세권', val: 'urban' },
      { label: '의료 복합 상권', val: 'medical' },
    ]
  },
  {
    area: '입지 · 타겟', num: '5 / 9', text: '주력 타겟 환자군은?', type: 'choice', options: [
      { label: '영유아 · 소아', val: 'kids' },
      { label: '2030 직장인', val: 'young' },
      { label: '4060 중장년', val: 'senior' },
    ]
  },
  {
    area: '입지 · 타겟', num: '6 / 9', text: '핵심 마케팅 채널은?', type: 'choice', options: [
      { label: '온라인 (SNS/광고)', val: 'online' },
      { label: '오프라인 (모임/제휴)', val: 'offline' },
      { label: '리뷰 · 플레이스', val: 'review' },
    ]
  },
  {
    area: '진료 · 전략', num: '7 / 9', text: '비급여 진료 비중 계획은?', type: 'choice', options: [
      { label: '보험 중심 (70%)', val: 'insurance' },
      { label: '보험+비급여 혼합', val: 'mixed' },
      { label: '비급여 중심 (70%)', val: 'premium' },
    ]
  },
  {
    area: '진료 · 전략', num: '8 / 9', text: '주력 진료 특화 방식은?', type: 'choice', options: [
      { label: '술기 · 침구 특화', val: 'treatment' },
      { label: '한약 · 처방 특화', val: 'herbal' },
      { label: '시스템 · 장비 특화', val: 'program' },
    ]
  },
  {
    area: '진료 · 전략', num: '9 / 9', text: '의원의 장기적 성장 비전은?', type: 'choice', options: [
      { label: '전문성 기반 단독개원', val: 'specialist' },
      { label: '안정적 지역 주치의', val: 'gp' },
      { label: '시스템 기반 플랫폼화', val: 'premium' },
    ]
  }
];

const areasB = ['CS', '마케팅', 'HR', '진료', 'CRM', '비전'];
const questionsB_basic = [
  {
    area: '기본 정보', num: '1 / 21', text: '현재 월 평균 매출은?', type: 'choice', areaKey: 'basic', options: [
      { label: '3천만원 미만', val: 'r1' }, { label: '3천~5천', val: 'r2' }, { label: '5천~8천', val: 'r3' }, { label: '8천만원 이상', val: 'r4' }
    ]
  },
  {
    area: '기본 정보', num: '2 / 21', text: '하루 평균 내원 환자는?', type: 'choice', areaKey: 'basic', options: [
      { label: '20명 미만', val: 'v1' }, { label: '20~40명', val: 'v2' }, { label: '40~60명', val: 'v3' }, { label: '60명 이상', val: 'v4' }
    ]
  },
  { area: '기본 정보', num: '3 / 21', text: '6개월 후 매출 목표는?', type: 'text_input', areaKey: 'basic', placeholder: '예: 1억원' }
];

const questionsB_scale = [
  { area: 'CS', areaKey: 'CS', num: '4 / 21', text: '전체 CS 프로세스가 체계적으로 운영됩니까?' },
  { area: 'CS', areaKey: 'CS', num: '5 / 21', text: '직원 CS 교육이 정기적으로 이루어집니까?' },
  { area: 'CS', areaKey: 'CS', num: '6 / 21', text: '환자 불만 개선 프로세스가 있습니까?' },
  { area: '마케팅', areaKey: '마케팅', num: '7 / 21', text: '마케팅 채널이 전략적으로 운영됩니까?' },
  { area: '마케팅', areaKey: '마케팅', num: '8 / 21', text: '차별화된 브랜드 스토리가 있습니까?' },
  { area: '마케팅', areaKey: '마케팅', num: '9 / 21', text: '마케팅 투자 효율(ROI)을 측정합니까?' },
  { area: 'HR', areaKey: 'HR', num: '10 / 21', text: '채용 및 교육 시스템이 체계적입니까?' },
  { area: 'HR', areaKey: 'HR', num: '11 / 21', text: '직원 R&R과 평가 기준이 명확합니까?' },
  { area: 'HR', areaKey: 'HR', num: '12 / 21', text: '직원 이직률이 안정적으로 관리됩니까?' },
  { area: '진료', areaKey: '진료', num: '13 / 21', text: '치료 계획 설명이 표준화되어 있습니까?' },
  { area: '진료', areaKey: '진료', num: '14 / 21', text: '치료 성과를 데이터화하여 관리합니까?' },
  { area: '진료', areaKey: '진료', num: '15 / 21', text: '진료 프로토콜이 표준화되어 있습니까?' },
  { area: 'CRM', areaKey: 'CRM', num: '16 / 21', text: '재방문/이탈률을 정기 분석합니까?' },
  { area: 'CRM', areaKey: 'CRM', num: '17 / 21', text: '개인화된 사후 관리가 이루어집니까?' },
  { area: 'CRM', areaKey: 'CRM', num: '18 / 21', text: '휴면 환자 케어 프로그램이 있습니까?' },
  { area: '비전', areaKey: '비전', num: '19 / 21', text: '명확한 경영 비전과 로드맵이 있습니까?' },
  { area: '비전', areaKey: '비전', num: '20 / 21', text: '스케일업(분원 등) 전략이 있습니까?' },
  { area: '비전', areaKey: '비전', num: '21 / 21', text: '퍼스널 브랜딩 연계 전략이 있습니까?' }
];

const personaData = {
  P1: { name: '도심형 하이엔드 마스터', emoji: '🏙️', tagline: '도시의 정점에서 만나는 프리미엄 진료의 기준', tags: ['시스템형', '도심', '비급여 특화'], dna: '귀원은 고도의 시스템화된 진료와 도심 중심가의 지리적 이점을 결합하여 고부가가치 비급여 진료를 선도하는 유형입니다.', strategy: '현대식 빌딩 상권에 위치하여 스마트 기기를 활용한 정밀 진단 시스템을 구축하세요.', marketing: '그린 톤의 세련된 디자인으로 사이트를 구성하고 타겟팅 광고에 집중하세요.', risk: '높은 고정비 관리가 중요하며, 최고급 고객 경험 설계를 통해 객단가를 방어하세요.' },
  P2: { name: '동네 주치의 휴먼 가이드', emoji: '🏠', tagline: '이웃의 건강을 지키는 따뜻한 소통의 공간', tags: ['원장중심', '거주지', '보험일반'], dna: '원장님 개인의 신뢰도를 바탕으로 거주 밀착형 상권에서 안정적인 진료를 제공하는 동네 거점 유형입니다.', strategy: '대화 중심의 아늑한 진료 환경을 조성하세요. 지역 커뮤니티 신뢰가 핵심입니다.', marketing: '편안한 색감을 활용하고 지역 커뮤니티(맘카페 등)와 소통하세요.', risk: '낮은 객단가 보완을 위한 진료 효율성 향상과 소통의 균형이 중요합니다.' },
  P3: { name: '광역 거점 시스템 병원가', emoji: '🏥', tagline: '체계적인 의료 시스템으로 지역을 선도하는 병원', tags: ['시스템형', '거주지', '비급여 특화'], dna: '대형 시설과 다수의 의료진이 체계적으로 움직이는 대규모 지역 거점 메디컬 센터 유형입니다.', strategy: '입원실 운영과 협진 시스템을 강화하세요. 대형 로비와 최신 장비로 전문성을 시각화해야 합니다.', marketing: '신뢰감 있는 디자인과 광역 검색 광고, 인근 의원 네트워크 구축에 힘쓰세요.', risk: '복잡한 조직 관리 비용이 높으므로 표준 매뉴얼과 인사 시스템 도입이 필수입니다.' },
  P4: { name: '오피스 타켓 쾌속 클리닉', emoji: '⌚', tagline: '직장인의 시간을 아껴주는 효율적 솔루션', tags: ['원장중심', '도심', '보험일반'], dna: '도심 오피스 상권에서 바쁜 직장인들을 위해 빠르고 정확한 진료를 제공하는 속도 중심 모델입니다.', strategy: '예약 시스템 최적화와 점심/퇴근 시간 연장 운영 등 타켓 맞춤형 운영이 필요합니다.', marketing: '에너제틱한 컬러를 활용하고 카카오톡 예약 등 디지털 접근성을 극대화하세요.', risk: '이탈 방지를 위한 CRM과 신속한 치료 후 팔로업 안내가 수익 유지의 핵심입니다.' },
  P5: { name: '네트워크 브랜딩 전문가', emoji: '🌐', tagline: '통일된 매뉴얼로 구현하는 시스템 경영의 정석', tags: ['시스템형', '도심', '보험일반'], dna: '일관된 매뉴얼과 강력한 브랜드 인지도를 가진 브랜드 지향형 모델입니다.', strategy: '지점 간 진료 경험 편차를 없애는 브랜딩 가이드를 수립하세요. 브랜드 이미지가 핵심 자산입니다.', marketing: '안정적 브랜딩으로 통합 마케팅을 실행하고 유튜브 등 대형 플랫폼 노출을 강화하세요.', risk: '브랜드 가이드라인 준수와 주기적인 품질 관리(QC)가 가장 중요한 과제입니다.' },
  P6: { name: '전통 술기 명인(匠人)', emoji: '🪵', tagline: '한 올의 침끝에 정성을 담는 의술의 경지', tags: ['원장중심', '거주지', '비급여 특화'], dna: '원장님의 깊이 있는 술기를 바탕으로 고단가 처방을 이끄는 장인 정신형 모델입니다.', strategy: ' madera 감성의 인테리어와 정성스러운 1:1 진료 과정을 설계하세요.', marketing: '감성적인 이미지보다는 깊이 있는 치료 후기 중심의 브랜딩이 효과적입니다.', risk: '원장님 1인 의존도가 높으므로 보조 진료팀을 통한 부하 관리가 필요합니다.' },
  P7: { name: '뉴타운 스마트 그로어', emoji: '📈', tagline: '데이터로 성장하는 활기찬 신도시 주치의', tags: ['시스템형', '거주지', '보험일반'], dna: '신도시 아파트 단지에서 젊은 부부와 아이들을 타겟으로 데이터 진료를 제공하는 모델입니다.', strategy: '태블릿 기반의 가시적인 진료 결과를 제공하세요. 모던한 공간 디자인이 중요합니다.', marketing: '밝고 희망찬 색감을 사용하고 맘카페 협력 및 커뮤니티 리뷰 관리에 힘쓰세요.', risk: '초기 환자들을 데이터 기반으로 강력히 잡아두는 충성 고객 관리 시스템이 필수입니다.' },
  P8: { name: '실속형 1인 개원가', emoji: '🖱️', tagline: '미니멀한 경영으로 구현하는 1인 경영의 극대화', tags: ['원장중심', '도심', '비급여 특화'], dna: '소액 투자, 고효율 매출을 지향하며 자동화 툴을 적극 활용하는 1인 실속파 모델입니다.', strategy: '작지만 컴팩트한 진료실을 구축하고 운영 비용을 최소화하여 수익성을 높이세요.', marketing: '정밀 타겟 광고를 통해 꼭 필요한 환자들만 선별 유입시키는 스마트 전략을 펴세요.', risk: '독단적 경영을 방지하기 위해 주기적인 경영 지표 분석과 전문가 네트워킹이 필요합니다.' },
  P9: { name: '디지털 헬스케어 선구자', emoji: '🤖', tagline: '테크놀로지로 완성하는 차세대 진료의 미래', tags: ['시스템형', '도심', '장비중심'], dna: '최첨단 장비와 데이터를 분석하여 과학적인 진료를 선도하는 테크형 모델입니다.', strategy: '미래지향적 인테리어와 데이터 관제실을 구축하여 환자에게 수치를 보여주세요.', marketing: '기술력을 앞세운 전문성 마케팅과 언론 홍보 등 기술 우위 이미지를 선점하세요.', risk: '장비 업그레이드 비용이 높으므로 투자 대비 수익성(ROI) 관리가 생명입니다.' },
  P10: { name: '지역 밀착 맘카페 멘토', emoji: '👶', tagline: '아이와 엄마의 마음을 가장 잘 아는 다정한 상담사', tags: ['원장중심', '거주지', '술기/보약'], dna: '편안한 소통을 통해 지역 맘들의 멘토 역할을 수행하는 관계 중심형 모델입니다.', strategy: '유모차 동선과 수유실을 갖추세요. 가족 단위 보험 진료와 보약의 믹스가 핵심입니다.', marketing: '따뜻한 브랜딩을 활용하고 맘카페 인플루언서 전략을 사용하세요.', risk: '부정적 평판 확산이 빠르므로 의료적 원칙과 친절함의 균형을 사수해야 합니다.' },
  P11: { name: '퍼포먼스 마케팅 집중형', emoji: '📢', tagline: '압도적 노출과 트렌디한 감각으로 시장을 장악하는 모델', tags: ['시스템형', '도심', '보험/일반'], dna: '강력한 노출과 트렌디한 비주얼로 환자를 폭발적으로 유입시키는 마케팅 엔진형 모델입니다.', strategy: '로비 내 포토존이나 굿즈 기획 등 환자가 SNS에 공유하고 싶은 공간을 만드세요.', marketing: '숏폼 영상과 파격적인 이벤트 등 노출 중심의 퍼포먼스 마케팅에 올인하세요.', risk: '유입된 환자를 재방문으로 이끄는 CRM 최적화 없이는 광고비 효율이 급락합니다.' },
  P12: { name: '고부가가치 VIP 클리닉', emoji: '👑', tagline: '소수 정예를 위한 최상의 품격과 맞춤형 케어', tags: ['원장중심', '도심', '비급여 특화'], dna: '프라이빗한 프라이빗 룸에서 상위 1% 소수 정예 환자를 진료하는 하이엔드형입니다.', strategy: '전담 코디네이터 배치와 호텔급 서비스를 제공하세요. 소개 중심의 폐쇄적 운영을 권장합니다.', marketing: '고급스러운 브랜딩과 회원제 클럽 방식의 마케팅 전략이 유효합니다.', risk: '환자 이탈 시 타격이 크므로 극도의 세밀한 상담 데이터 기반 개인 케어가 필수입니다.' }
};

const personasLogic = {
  getPersona(answers) {
    const scale = answers[0] || 'M';
    const loc = answers[3] || 'urban';
    const target = answers[4] || 'young';
    const mkt = answers[5] || 'online';
    const rev = answers[6] || 'mixed';
    const style = answers[7] || 'treatment';
    const brand = answers[8] || 'gp';

    const isSystem = (scale !== 'S' || brand !== 'gp');
    const isUrban = (loc === 'urban' || loc === 'medical');
    const isPremium = (rev === 'premium');

    if (isSystem && isUrban && isPremium) return 'P1';
    if (!isSystem && !isUrban && !isPremium) return 'P2';
    if (isSystem && !isUrban && isPremium) return 'P3';
    if (!isSystem && isUrban && !isPremium) return 'P4';
    if (isSystem && isUrban && !isPremium && brand === 'specialist') return 'P5';
    if (!isSystem && !isUrban && isPremium && style === 'treatment') return 'P6';
    if (isSystem && !isUrban && !isPremium) return 'P7';
    if (!isSystem && scale === 'S' && isUrban && isPremium) return 'P8';
    if (isSystem && isUrban && style === 'program') return 'P9';
    if (!isSystem && !isUrban && target === 'kids') return 'P10';
    if (isSystem && isUrban && (mkt === 'online' || mkt === 'review')) return 'P11';
    if (!isSystem && isUrban && isPremium && brand === 'premium') return 'P12';

    return isPremium ? 'P1' : (isUrban ? 'P4' : 'P2');
  }
};

const prescriptionData = {
  'CS+마케팅': { title: 'CS·마케팅 동시 강화 처방', desc: '유입과 응대 시스템이 모두 미흡합니다. 마케팅 집출 전에 응대 매뉴얼부터 확립해야 광고비 낭비를 막을 수 있습니다.', steps: [{ title: 'CS 구축', desc: '응대 스크립트 제작 및 직원 교육' }, { title: '채널 정비', desc: '플레이스 최적화 및 블로그 체계화' }, { title: '통합 캠페인', desc: 'CS 기반 신환 유입 광고 집행' }] },
  'default': { title: '종합 경영 시스템 강화 처방', desc: '전 영역의 균형적 성장이 필요합니다. 우선순위 영역을 정해 3개월 단위로 집중 개선하세요.', steps: [{ title: '현황 진단', desc: '영역별 지표 수치화 및 타겟 설정' }, { title: '집중 개선', desc: '취약 영역 프로토콜 표준화' }, { title: '시스템화', desc: '자동화 툴 도입 및 전 직원 숙지' }] }
};

const prescriptions = {
  get(weakAreas) {
    const key = weakAreas.sort().join('+');
    return prescriptionData[key] || prescriptionData['default'];
  }
};

let currentScreen = 'screen-splash';
let currentQuestions = [];
let questionIndex = 0;
let selectedOption = null;

function goToScreen(id) {
  const next = document.getElementById(id);
  if (!next) {
    console.error('Screen not found:', id);
    return;
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  next.classList.add('active');
  currentScreen = id;
  window.scrollTo(0, 0);
}

function formatPhone(v) {
  const d = v.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 7) return d.slice(0, 3) + '-' + d.slice(3);
  return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7, 11);
}

function handleNameKeyPress(e) { if (e.key === 'Enter') document.getElementById('input-phone').focus(); }
function handlePhoneKeyPress(e) { if (e.key === 'Enter') document.getElementById('input-email').focus(); }
function handleEmailKeyPress(e) { if (e.key === 'Enter') submitForm(); }

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleConsent(id) {
  const el = document.getElementById(id);
  el.classList.toggle('checked');
  if (id === 'c1') state.consent1 = el.classList.contains('checked');
  if (id === 'c2') state.consent2 = el.classList.contains('checked');
}

function submitForm() {
  const name = document.getElementById('input-name').value.trim();
  const phone = document.getElementById('input-phone').value.trim();
  const email = document.getElementById('input-email').value.trim();
  if (!name) { showToast('성함을 입력해 주세요'); return; }
  if (phone.length < 12) { showToast('연락처를 정확히 입력해 주세요'); return; }
  if (!email.includes('@')) { showToast('이메일을 정확히 입력해 주세요'); return; }
  if (!state.consent1) { showToast('개인정보 동의가 필요합니다'); return; }
  state.name = name; state.phone = phone; state.email = email;
  sendToSheet({ ...state, step: '정보입력완료' });
  goToScreen('screen-branch');
}

async function sendToSheet(data) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, ts: new Date().toISOString() })
    });
  } catch (e) { }
}

function startRouteA() {
  state.route = 'A'; state.answers = []; currentQuestions = questionsA; questionIndex = 0;
  renderQuestion(); goToScreen('screen-question');
}

function startRouteB() {
  state.route = 'B'; state.answers = []; state.bMetrics = { revenue: '', visitors: '', goal: '' };
  currentQuestions = [...questionsB_basic, ...questionsB_scale.map(q => ({ ...q, type: 'scale' }))];
  questionIndex = 0; renderQuestion(); goToScreen('screen-question');
}

function renderQuestion() {
  const q = currentQuestions[questionIndex];
  if (!q) { finishQuestions(); return; }
  const total = currentQuestions.length;
  document.getElementById('q-progress-fill').style.width = (questionIndex / total * 100) + '%';
  document.getElementById('q-progress-label').textContent = state.route === 'A' ? '개원 DNA 진단' : '경영 밸런스 진단';
  document.getElementById('q-progress-fraction').textContent = (questionIndex + 1) + ' / ' + total;
  document.getElementById('q-area-label').textContent = q.area;
  document.getElementById('q-num-label').textContent = q.num;
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-sub').textContent = q.sub || '';

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  if (q.type === 'choice') {
    q.options.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'option-item';
      div.innerHTML = '<div class="option-dot"></div><div class="option-content"><div class="option-label">' + opt.label + '</div>' + (opt.desc ? '<div class="option-desc">' + opt.desc + '</div>' : '') + '</div>';
      div.onclick = () => { selectedOption = opt.val; nextQuestion(); };
      container.appendChild(div);
    });
  } else if (q.type === 'scale') {
    const row = document.createElement('div');
    row.className = 'scale-options';
    for (let s = 1; s <= 5; s++) {
      const btn = document.createElement('div');
      btn.className = 'scale-btn';
      btn.innerHTML = '<div class="scale-num">' + s + '</div>';
      btn.onclick = () => { selectedOption = s; nextQuestion(); };
      row.appendChild(btn);
    }
    container.appendChild(row);
  } else if (q.type === 'text_input') {
    const inp = document.createElement('input');
    inp.className = 'form-input'; inp.placeholder = q.placeholder || '';
    inp.oninput = (e) => { state.bMetrics.goal = e.target.value; selectedOption = e.target.value; };
    container.appendChild(inp);
    setTimeout(() => inp.focus(), 100);
  }
}

function nextQuestion() {
  if (selectedOption === null && currentQuestions[questionIndex].type !== 'text_input') { showToast('항목을 선택해 주세요'); return; }
  state.answers[questionIndex] = selectedOption;
  if (state.route === 'B') {
    if (questionIndex === 0) state.bMetrics.revenue = selectedOption;
    if (questionIndex === 1) state.bMetrics.visitors = selectedOption;
  }
  questionIndex++; selectedOption = null;
  if (questionIndex >= currentQuestions.length) { finishQuestions(); return; }
  renderQuestion();
}

function goBackQuestion() {
  if (questionIndex === 0) goToScreen('screen-branch');
  else { questionIndex--; renderQuestion(); }
}

function finishQuestions() {
  goToScreen('screen-loading');
  setTimeout(() => generateReport(), 2500);
}

function generateReport() {
  const container = document.getElementById('report-content');
  if (state.route === 'A') {
    const personaKey = personasLogic.getPersona(state.answers);
    const p = personaData[personaKey];
    container.innerHTML = buildReportA(p);
  } else {
    const scaleAnswers = state.answers.slice(3);
    const scores = {};
    areasB.forEach(a => scores[a] = []);
    questionsB_scale.forEach((q, i) => {
      const ak = q.areaKey;
      if (!scores[ak]) scores[ak] = [];
      scores[ak].push(Number(scaleAnswers[i]) || 3);
    });
    const avgScores = {};
    areasB.forEach(a => {
      const arr = scores[a];
      avgScores[a] = arr && arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 3;
    });
    const sorted = areasB.slice().sort((a, b) => avgScores[a] - avgScores[b]);
    const weakTwo = [sorted[0], sorted[1]];
    const rx = prescriptions.get(weakTwo);
    container.innerHTML = buildReportB(avgScores, weakTwo, rx);
  }
  goToScreen('screen-report');
}

function buildReportA(p) {
  return '<div class="report-container" id="report-container"><div class="report-header"><div class="report-title">개원 DNA 진단 리포트</div><div class="report-persona">' + p.emoji + ' ' + p.name + '</div><div class="report-tagline">' + p.tagline + '</div></div><div class="report-body"><div class="report-section"><div class="section-title">DNA 상세 분석</div><div class="analysis-box"><p>' + p.dna + '</p></div></div><div class="report-section"><div class="section-title">입지 및 타겟 전략</div><div class="analysis-box"><p>' + p.strategy + '</p></div></div><div class="report-section"><div class="section-title">마케팅 제언</div><div class="highlight-box"><p>' + p.marketing + '</p></div></div><div class="report-section"><div class="section-title">경영 리스크 관리</div><div class="risk-box"><p>' + p.risk + '</p></div></div><div class="next-step-box"><strong>NEXT STEP:</strong><br>한가온컴퍼니 전문가와의 1:1 상담을 통해 구체적인 개원 로드맵을 설계해 보세요.</div></div><div class="report-footer-actions"><button class="save-btn" onclick="saveReport()">이미지 저장</button><button class="restart-btn" onclick="location.reload()">다시 하기</button></div></div>';
}

function buildReportB(avgScores, weakTwo, rx) {
  const rxSteps = rx.steps.map((s, i) => '<div class="rx-step"><div class="rx-num">' + (i + 1) + '</div><div class="rx-content"><div class="rx-title">' + s.title + '</div><div class="rx-desc">' + s.desc + '</div></div></div>').join('');
  return '<div class="report-container" id="report-container"><div class="report-header"><div class="report-title">경영 밸런스 진단 리포트</div><div class="report-persona">📊 원장님 진단 결과</div></div><div class="report-body"><div class="report-section"><div class="section-title">6대 영역 밸런스</div>' + areasB.map(a => '<div class="score-row"><span>' + a + '</span><div class="bar-bg"><div class="bar-fill" style="width:' + (avgScores[a] * 20) + '%"></div></div><span>' + avgScores[a].toFixed(1) + '</span></div>').join('') + '</div><div class="report-section"><div class="section-title">⚠️ 취약 영역 정밀 분석</div><div class="analysis-box"><p>현재 <strong>' + weakTwo.join(', ') + '</strong> 영역의 보완이 시급한 것으로 분석되었습니다. ' + rx.desc + '</p></div></div><div class="report-section"><div class="section-title">성장 로드맵 솔루션</div><div class="rx-card">' + rxSteps + '</div></div><div class="next-step-box"><strong>전문가 어드바이스:</strong><br>취약 영역에 대한 현장 정밀 진단과 맞춤형 시스템 구축이 필요합니다.</div></div><div class="report-footer-actions"><button class="save-btn" onclick="saveReport()">이미지 저장</button><button class="restart-btn" onclick="location.reload()">다시 하기</button></div></div>';
}

function saveReport() {
  const el = document.getElementById('report-container');
  if (!el) return;
  showToast('이미지 생성 중...');
  if (window.html2canvas) {
    window.html2canvas(el, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
      const link = document.createElement('a');
      link.download = "진단리포트.png";
      link.href = canvas.toDataURL();
      link.click();
      showToast('저장 완료!');
    });
  } else { showToast('저장 도구 로드 중...'); }
}

const init = () => {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const splash = document.getElementById('screen-splash');
  if (splash) splash.classList.add('active');
  const phone = document.getElementById('input-phone');
  if (phone) phone.addEventListener('input', function () { this.value = formatPhone(this.value); });
};

window.addEventListener('load', init);
window.goToForm = () => goToScreen('screen-form');
window.goToScreen = goToScreen;
window.submitForm = submitForm;
window.toggleConsent = toggleConsent;
window.startRouteA = startRouteA;
window.startRouteB = startRouteB;
window.nextQuestion = nextQuestion;
window.goBackQuestion = goBackQuestion;
window.saveReport = saveReport;
window.handleNameKeyPress = handleNameKeyPress;
window.handlePhoneKeyPress = handlePhoneKeyPress;
window.handleEmailKeyPress = handleEmailKeyPress;