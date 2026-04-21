const state = {
  name: '', phone: '', email: '',
  consent1: false, consent2: false,
  route: null, // 'A' | 'B'
  answers: [],
  currentQ: 0,
  bMetrics: { revenue: '', visitors: '', goal: '' }
};

// Google Sheets integration
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx7HO4zQvne15bjH6t257xRc6e0QR68u6phGGoRNIjMFf2YQNKN65EC91LOAX982N03/exec';

// ─────────────────────────────────────────
// ROUTE A: 9 QUESTIONS
// ─────────────────────────────────────────
const questionsA = [
  // 규모/시설 (3)
  {
    area: '규모 · 시설', num: '1 / 9',
    text: '개원 시 계획하고 계신 의원 규모는 어느 정도입니까?',
    sub: '진료 공간 기준으로 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '소형 (1~2진료실)', desc: '집중 진료, 초기 비용 최소화 지향', val: 'S' },
      { label: '중형 (3~4진료실)', desc: '균형 잡힌 운영, 성장 가능성 확보', val: 'M' },
      { label: '대형 (5진료실 이상)', desc: '복합 센터형, 높은 초기 투자 감수', val: 'L' },
    ]
  },
  {
    area: '규모 · 시설', num: '2 / 9',
    text: '입원실 운영에 대한 의지는 어느 정도입니까?',
    sub: '한방 병원 전환 가능성을 포함하여 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '입원실 운영 계획 없음', desc: '외래 집중형 운영 선호', val: 'no' },
      { label: '향후 확장 시 고려', desc: '현재는 외래 중심, 추후 검토', val: 'maybe' },
      { label: '처음부터 입원실 포함', desc: '병원급 또는 요양급 지향', val: 'yes' },
    ]
  },
  {
    area: '규모 · 시설', num: '3 / 9',
    text: '개원 초기 인테리어 및 시설에 투자할 의향은?',
    sub: '3.3㎡(평) 기준 인테리어 투자 성향입니다.',
    type: 'choice',
    options: [
      { label: '최소 투자형 (100만원 미만/평)', desc: '기능 위주, 실용적 인테리어 선호', val: 'low' },
      { label: '표준 투자형 (100~200만원/평)', desc: '브랜드와 실용성의 균형', val: 'mid' },
      { label: '프리미엄 투자형 (200만원 이상/평)', desc: '공간 자체가 브랜드, 고급화 지향', val: 'high' },
    ]
  },
  // 입지/환경 (3)
  {
    area: '입지 · 환경', num: '4 / 9',
    text: '선호하는 개원 상권은 어느 유형입니까?',
    sub: '진료 모델과 가장 잘 맞는 입지를 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '주거 밀집 지역', desc: '아파트 단지, 생활 밀착형 상권', val: 'residential' },
      { label: '도심 / 역세권', desc: '유동인구 풍부, 직장인 유입 가능', val: 'urban' },
      { label: '의료 복합 상권', desc: '병원 밀집지, 전문 진료 이미지 구축', val: 'medical' },
    ]
  },
  {
    area: '입지 · 환경', num: '5 / 9',
    text: '주력 타겟으로 삼고 싶은 환자군은?',
    sub: '주요 수익원이 될 핵심 환자 유형입니다.',
    type: 'choice',
    options: [
      { label: '영유아 · 소아 (성장/비염)', desc: '부모 만족도가 재방문율 결정', val: 'kids' },
      { label: '2030 직장인 (통증/피로)', desc: '빠른 치료 효과, SNS 구전 활발', val: 'young' },
      { label: '4060 중장년 (만성질환)', desc: '장기 관리형, CRM 중심 운영', val: 'senior' },
    ]
  },
  {
    area: '입지 · 환경', num: '6 / 9',
    text: '주력으로 활용할 마케팅 채널은?',
    sub: '초기 환자 유입 전략의 핵심을 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '온라인 (SNS/블로그/광고)', desc: '디지털 퍼스트, 전환율 측정 용이', val: 'online' },
      { label: '지역 커뮤니티 / 오프라인', desc: '입소문 기반, 진성 환자 확보', val: 'offline' },
      { label: '병원 리뷰 플랫폼 (네이버/카카오)', desc: '검색 점령형, SEO 중심 전략', val: 'review' },
    ]
  },
  // 진료/전략 (3)
  {
    area: '진료 · 전략', num: '7 / 9',
    text: '주요 수익 모델의 구성은 어떻게 계획하십니까?',
    sub: '보험 진료 vs 비급여 진료 비율 방향성입니다.',
    type: 'choice',
    options: [
      { label: '보험 진료 중심 (70% 이상)', desc: '안정적 내원 확보, 단가 낮은 편', val: 'insurance' },
      { label: '보험+비급여 혼합 (50:50)', desc: '균형형, 진료 다양성 확보', val: 'mixed' },
      { label: '비급여 중심 (70% 이상)', desc: '고단가 진료, 마케팅 의존도 높음', val: 'premium' },
    ]
  },
  {
    area: '진료 · 전략', num: '8 / 9',
    text: '본인의 한의학적 진료 스타일은?',
    sub: '환자와의 관계 설정 방식을 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '침 · 추나 중심 처치형', desc: '빠른 효과 제공, 회전율 중시', val: 'treatment' },
      { label: '탕약 · 보약 처방형', desc: '장기 관리, 신뢰 기반 매출 형성', val: 'herbal' },
      { label: '복합 프로그램형', desc: '패키지 설계, 비급여 중심 운영', val: 'program' },
    ]
  },
  {
    area: '진료 · 전략', num: '9 / 9',
    text: '지향하는 브랜드 형태는?',
    sub: '중장기 병원 아이덴티티 방향을 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '전문 특화 한의원', desc: '척추/성장/난임 등 1~2개 분야 집중', val: 'specialist' },
      { label: '동네 주치의형 한의원', desc: '친근함과 신뢰, 생활 밀착 케어', val: 'gp' },
      { label: '프리미엄 웰니스 클리닉', desc: '고급 이미지, 체험·감성 마케팅', val: 'premium' },
    ]
  }
];

// ─────────────────────────────────────────
// ROUTE B: 3 BASIC + 18 SCALE QUESTIONS
// ─────────────────────────────────────────
const questionsB_basic = [
  {
    area: '기본 수치', num: '기본 1 / 3',
    text: '현재 한의원의 월 매출 구간은?',
    sub: '가장 근접한 구간을 선택해 주세요.',
    type: 'choice',
    options: [
      { label: '3천만원 미만', val: 'r1', desc: '초기 성장 단계' },
      { label: '3천만원 ~ 5천만원', val: 'r2', desc: '안정화 단계' },
      { label: '5천만원 ~ 8천만원', val: 'r3', desc: '성장 가속 단계' },
      { label: '8천만원 이상', val: 'r4', desc: '고성과 단계' },
    ]
  },
  {
    area: '기본 수치', num: '기본 2 / 3',
    text: '일평균 내원객 수는 몇 명입니까?',
    sub: '진료일 기준 하루 평균입니다.',
    type: 'choice',
    options: [
      { label: '20명 미만', val: 'v1', desc: '' },
      { label: '20명 ~ 40명', val: 'v2', desc: '' },
      { label: '40명 ~ 60명', val: 'v3', desc: '' },
      { label: '60명 이상', val: 'v4', desc: '' },
    ]
  },
  {
    area: '기본 수치', num: '기본 3 / 3',
    text: '6개월 후 달성하고 싶은 월 매출 목표는?',
    sub: '솔직한 목표를 자유롭게 입력해 주세요.',
    type: 'text_input',
    placeholder: '예: 7천만원',
  }
];

const areasB = ['CS', '마케팅', 'HR', '진료', 'CRM', '비전'];
const questionsB_scale = [
  // CS (3)
  { area: 'CS · 고객서비스', num: '진단 1 / 18', text: '초진 환자 응대부터 귀가까지, 전반적인 CS 프로세스가 체계적으로 운영되고 있습니까?', sub: '1점: 거의 없음 / 5점: 완벽히 갖춰짐', areaKey: 'CS' },
  { area: 'CS · 고객서비스', num: '진단 2 / 18', text: '직원들의 환자 응대 서비스 교육 및 피드백이 정기적으로 이루어지고 있습니까?', sub: '1점: 전혀 없음 / 5점: 매월 정기 실시', areaKey: 'CS' },
  { area: 'CS · 고객서비스', num: '진단 3 / 18', text: '환자 불만 접수 및 개선 프로세스가 명확히 수립되어 실행되고 있습니까?', sub: '1점: 없음 / 5점: 완전 체계화', areaKey: 'CS' },
  // 마케팅 (3)
  { area: '마케팅 · 브랜드', num: '진단 4 / 18', text: '온·오프라인 마케팅 채널이 전략적으로 운영되어 신규 환자가 꾸준히 유입되고 있습니까?', sub: '1점: 거의 없음 / 5점: 체계적 운영 중', areaKey: '마케팅' },
  { area: '마케팅 · 브랜드', num: '진단 5 / 18', text: '한의원만의 차별화된 브랜드 스토리와 비주얼 아이덴티티가 구축되어 있습니까?', sub: '1점: 없음 / 5점: 완전 구축', areaKey: '마케팅' },
  { area: '마케팅 · 브랜드', num: '진단 6 / 18', text: '마케팅 예산 대비 신환 유입 비용(CPL)을 측정하고 최적화하고 있습니까?', sub: '1점: 측정 안 함 / 5점: 지속 최적화', areaKey: '마케팅' },
  // HR (3)
  { area: 'HR · 인사관리', num: '진단 7 / 18', text: '직원 채용, 온보딩, 교육 시스템이 체계적으로 운영되고 있습니까?', sub: '1점: 비정형적 / 5점: 완전 체계화', areaKey: 'HR' },
  { area: 'HR · 인사관리', num: '진단 8 / 18', text: '직원들의 업무 역할(R&R)과 평가 기준이 명확히 정의되어 있습니까?', sub: '1점: 없음 / 5점: 문서화 완료', areaKey: 'HR' },
  { area: 'HR · 인사관리', num: '진단 9 / 18', text: '직원 만족도 및 이직률이 업계 평균 수준 이하로 관리되고 있습니까?', sub: '1점: 이직률 매우 높음 / 5점: 안정적', areaKey: 'HR' },
  // 진료 (3)
  { area: '진료 · 시스템', num: '진단 10 / 18', text: '초진 환자의 치료 계획(진료 로드맵)이 체계적으로 수립·공유되고 있습니까?', sub: '1점: 없음 / 5점: 완전 체계화', areaKey: '진료' },
  { area: '진료 · 시스템', num: '진단 11 / 18', text: '주력 비급여 프로그램의 환자 치료 성과(효과)를 측정하고 데이터화하고 있습니까?', sub: '1점: 없음 / 5점: 정기 데이터화', areaKey: '진료' },
  { area: '진료 · 시스템', num: '진단 12 / 18', text: '진료 표준화 프로토콜이 마련되어 원장 부재 시에도 일관된 진료가 가능합니까?', sub: '1점: 없음 / 5점: 완전 표준화', areaKey: '진료' },
  // CRM (3)
  { area: 'CRM · 환자관리', num: '진단 13 / 18', text: '기존 환자의 재방문율과 이탈률을 정기적으로 분석하고 개선 조치를 취하고 있습니까?', sub: '1점: 없음 / 5점: 정기 분석 중', areaKey: 'CRM' },
  { area: 'CRM · 환자관리', num: '진단 14 / 18', text: '환자별 치료 이력과 선호를 바탕으로 개인화된 후속 관리가 이루어지고 있습니까?', sub: '1점: 없음 / 5점: 개인화 완료', areaKey: 'CRM' },
  { area: 'CRM · 환자관리', num: '진단 15 / 18', text: '휴면 환자 재활성화 캠페인이나 환자 추천(리퍼럴) 프로그램이 운영 중입니까?', sub: '1점: 없음 / 5점: 정기 운영', areaKey: 'CRM' },
  // 비전 (3)
  { area: '비전 · 성장전략', num: '진단 16 / 18', text: '1년, 3년, 5년 단위의 명확한 경영 목표와 성장 로드맵이 수립되어 있습니까?', sub: '1점: 없음 / 5점: 완전 수립', areaKey: '비전' },
  { area: '비전 · 성장전략', num: '진단 17 / 18', text: '분원 확장, 법인화, 프랜차이즈 등 스케일업 전략을 검토한 적이 있습니까?', sub: '1점: 생각 없음 / 5점: 실행 중', areaKey: '비전' },
  { area: '비전 · 성장전략', num: '진단 18 / 18', text: '원장님 개인 브랜드(퍼스널 브랜딩)와 한의원 브랜드의 연계 전략이 존재합니까?', sub: '1점: 없음 / 5점: 완전 연계', areaKey: '비전' },
];

// ─────────────────────────────────────────
// PERSONAS (Route A: 12개)
// ─────────────────────────────────────────
const personas = {
  getPersona(answers) {
    const scale = answers[0] || 'M';      // S / M / L
    const loc = answers[3] || 'urban';    // residential / urban / medical
    const target = answers[4] || 'young'; // kids / young / senior
    const mkt = answers[5] || 'online';  // online / offline / review
    const revModel = answers[6] || 'mixed'; // insurance / mixed / premium
    const style = answers[7] || 'treatment'; // treatment / herbal / program
    const brand = answers[8] || 'gp';      // specialist / gp / premium

    const isSystem = (scale !== 'S' || brand !== 'gp');
    const isUrban = (loc === 'urban' || loc === 'medical');
    const isPremium = (revModel === 'premium');

    // 1. 도심형 하이엔드 마스터: 시스템형 + 도심 + 비급여특화
    if (isSystem && isUrban && isPremium) return 'P1';
    // 2. 동네 주치의 휴먼 가이드: 원장중심 + 거주지 + 보험일반
    if (!isSystem && !isUrban && !isPremium) return 'P2';
    // 3. 광역 거점 시스템 병원가: 시스템형 + 거주지 + 비급여특화
    if (isSystem && !isUrban && isPremium) return 'P3';
    // 4. 오피스 타켓 쾌속 클리닉: 원장중심 + 도심 + 보험일반
    if (!isSystem && isUrban && !isPremium) return 'P4';
    // 5. 네트워크 브랜딩 전문가: 시스템형 + 도심 + 보험일반
    if (isSystem && isUrban && !isPremium && brand === 'specialist') return 'P5';
    // 6. 전통 술기 명인: 원장중심 + 거주지 + 비급여특화
    if (!isSystem && !isUrban && isPremium && style === 'treatment') return 'P6';
    // 7. 뉴타운 스마트 그로어: 시스템형 + 거주지 + 보험일반
    if (isSystem && !isUrban && !isPremium) return 'P7';
    // 8. 실속형 1인 개원가: 원장중심 + 도심 + 비급여특화 (S규모)
    if (!isSystem && scale === 'S' && isUrban && isPremium) return 'P8';
    // 9. 디지털 헬스케어 선구자: 시스템형 + 도심 + 장비중심
    if (isSystem && isUrban && style === 'program') return 'P9';
    // 10. 지역 밀착 맘카페 멘토: 원장중심 + 거주지 + 술기/보약
    if (!isSystem && !isUrban && target === 'kids') return 'P10';
    // 11. 퍼포먼스 마케팅 집중형: 시스템형 + 도심 + 보험/일반
    if (isSystem && isUrban && (mkt === 'online' || mkt === 'review')) return 'P11';
    // 12. 고부가가치 VIP 클리닉: 원장중심 + 도심 + 비급여특화 (프리미엄 지향)
    if (!isSystem && isUrban && isPremium && brand === 'premium') return 'P12';

    // Default Fallbacks
    if (isPremium) return 'P1';
    if (isUrban) return 'P4';
    return 'P2';
  }
};

const personaData = {
  P1: {
    name: '도심형 하이엔드 마스터',
    emoji: '🏙️',
    tagline: '도시의 정점에서 만나는 프리미엄 진료의 기준',
    tags: ['시스템형', '도심', '비급여 특화'],
    dna: '귀원은 고도의 시스템화된 진료와 도심 중심가의 지리적 이점을 결합하여 고부가가치 비급여 진료를 선도하는 유형입니다.',
    strategy: '세련된 현대식 빌딩 상권에 위치하여 스마트 기기를 활용한 정밀 진단 시스템을 구축하세요. 프리미엄 고객을 타겟으로 한 하이엔드 브랜딩이 필수입니다.',
    marketing: '골드와 네이비 톤의 격조 높은 디자인으로 온라인 사이트를 구성하고, 타겟팅 광고를 통해 전문성을 강조하는 디지털 퍼포먼스 마케팅에 집중하세요.',
    risk: '높은 고정비와 경쟁 심화가 리스크입니다. 객단가 방어와 재방문율 관리를 위한 최고급 고객 경험(Customer Experience) 설계가 필요합니다.'
  },
  P2: {
    name: '동네 주치의 휴먼 가이드',
    emoji: '🏠',
    tagline: '이웃의 건강을 지키는 따뜻한 소통의 공간',
    tags: ['원장중심', '거주지', '보험일반'],
    dna: '원장님 개인의 신뢰도와 친근함을 바탕으로 거주 밀착형 상권에서 안정적인 보험 진료를 제공하는 동네 거점 유형입니다.',
    strategy: '환자(노인/아이)와 눈을 맞추며 대화하는 아늑한 진료 환경을 조성하세요. 지역 커뮤니티의 신뢰가 곧 매출로 이어지는 구조입니다.',
    marketing: '베이지와 그린 톤의 편안한 색감을 활용하고, 지역 밀착형 오프라인 이벤트나 소소한 입소문 마케팅(당근마켓 등)이 효과적입니다.',
    risk: '낮은 객단가로 인해 많은 환자 수가 필요합니다. 진료 효율성을 높이면서도 따뜻한 소통을 잃지 않는 균형 감각이 중요합니다.'
  },
  P3: {
    name: '광역 거점 시스템 병원가',
    emoji: '🏥',
    tagline: '체계적인 의료 시스템으로 지역을 선도하는 병원',
    tags: ['시스템형', '거주지', '비급여 특화'],
    dna: '대형 입원 시설과 다수의 의료진이 체계적으로 움직이는 대규모 지역 거점 메디컬 센터 유형입니다.',
    strategy: '입원실 운영과 여러 진료 과목의 협진 시스템을 구축하세요. 규모감 있는 병원 로비와 하이테크 장비를 통해 전문 의술의 신뢰도를 높여야 합니다.',
    marketing: '블루와 실버 톤의 신뢰감 있는 디자인을 사용하고, 광역 검색 광고와 지역 병의원 간의 전원 네트워크 구축에 집중하세요.',
    risk: '복잡한 조직 관리와 시설 투자 비용이 높습니다. 효율적인 인사 관리 시스템과 표준화된 진료 프로토콜 도입이 스케일업의 핵심입니다.'
  },
  P4: {
    name: '오피스 타켓 쾌속 클리닉',
    emoji: '⌚',
    tagline: '직장인의 시간을 아껴주는 효율적 통증 솔루션',
    tags: ['원장중심', '도심', '보험일반'],
    dna: '도심 오피스 상권에서 바쁜 직장인들을 위해 신속하고 정확한 진료를 제공하는 속도 중심의 클리닉 유형입니다.',
    strategy: '대기 시간을 최소화하는 예약 시스템과 빠른 통증 완화 술기에 집중하세요. 점심시간 및 퇴근시간 연장 운영 등 타겟 맞춤형 운영이 필요합니다.',
    marketing: '오렌지와 화이트 톤의 에너제틱한 컬러를 활용하여 SNS 광고와 카카오톡 예약 연동 등 디지털 접근성을 극대화하세요.',
    risk: '보험 위주 진료는 재방문 주기가 짧아야 수익이 유지됩니다. 신속한 치료 후 후속 관리 안내로 이탈을 방지하는 CRM이 필수입니다.'
  },
  P5: {
    name: '네트워크 브랜딩 전문가',
    emoji: '🌐',
    tagline: '통일된 매뉴얼로 구현하는 시스템 경영의 정석',
    tags: ['시스템형', '도심', '보험일반'],
    dna: '다양한 지점을 연결하는 시스템화된 경영 매뉴얼과 강력한 브랜드 인지도를 가진 브랜드 지향형 모델입니다.',
    strategy: '어느 지점에서나 일관된 진료 경험을 제공할 수 있도록 브랜딩 가이드를 수립하세요. 원장님보다는 브랜드 아이덴티티가 앞에 서는 구조입니다.',
    marketing: '퍼플과 블루 톤의 안정감 있는 브랜딩으로 통합 마케팅(IMC)을 실행하고, 대형 플랫폼(유튜브 등)을 활용해 브랜드 파워를 강화하세요.',
    risk: '브랜드 이미지 훼손 시 전 지점에 타격이 있을 수 있습니다. 브랜드 가이드라인 준수와 주기적인 품질 관리(QC)가 핵심입니다.'
  },
  P6: {
    name: '전통 술기 명인(匠人)',
    emoji: '🪵',
    tagline: '한 올의 침끝에 정성을 담는 의술의 경지',
    tags: ['원장중심', '거주지', '비급여 특화'],
    dna: '고즈넉한 한옥 느낌의 진료실에서 원장님의 깊이 있는 술기로 고단가 비급여 처방을 이끄는 장인 정신형 모델입니다.',
    strategy: '나무의 따뜻함이 느껴지는 인테리어와 정성스러운 진료 과정을 설계하세요. 환자 한 명 한 명에게 집중하는 고품격 1:1 진료가 핵심입니다.',
    marketing: '브라운과 우드 톤의 깊이 있는 브랜딩을 활용하고, 이미지 중심의 감성 마케팅보다는 신뢰도 높은 후기 중심의 브랜딩에 집중하세요.',
    risk: '원장님 개인의 체력 및 의존도가 매우 높습니다. 제자 양성 또는 보조 진료팀 구축으로 원장님의 진료 부하를 관리해야 합니다.'
  },
  P7: {
    name: '뉴타운 스마트 그로어',
    emoji: '📈',
    tagline: '데이터로 성장하는 활기찬 신도시 주치의',
    tags: ['시스템형', '거주지', '보험일반'],
    dna: '신도시 아파트 단지에서 젊은 부부와 아이들을 타겟으로 데이터를 활용한 스마트한 진료를 제공하는 성장 지향형입니다.',
    strategy: '태블릿과 차트를 연동한 가시적인 진료 결과를 제공하세요. 젊은 층이 선호하는 깔끔하고 모던한 공간 디자인이 중요합니다.',
    marketing: '옐로우와 그린 톤의 밝고 희망찬 색감을 사용하고, 지역 맘카페 협력 마케팅이나 커뮤니티 리뷰 관리에 힘쓰세요.',
    risk: '경쟁 의원들의 유입이 빠를 수 있습니다. 초기 환자들을 데이터 기반으로 강력히 Lock-in 하는 충성 고객 관리 시스템이 필요합니다.'
  },
  P8: {
    name: '실속형 1인 개원가',
    emoji: '🖱️',
    tagline: '미니멀한 경영으로 실현하는 1인 경영의 극대화',
    tags: ['원장중심', '도심', '비급여 특화'],
    dna: '소액 투자, 고효율 매출을 지향하며 키오스크 등 자동화 툴을 적극 활용하는 1인 실속파 경영 모델입니다.',
    strategy: '컴팩트하고 깔끔한 진료실을 구축하고 운영 비용을 최소화하세요. 비급여 비중을 높여 수익성을 극대화하는 내실 있는 로드맵이 중요합니다.',
    marketing: '그레이와 화이트 톤의 미니멀 디자인을 활용하고, 정밀 타겟 광고를 통해 꼭 필요한 환자들만 선별 유입시키는 스마트 마케팅을 하세요.',
    risk: '혼자 모든 것을 결정해야 하는 독단적 경영의 위험이 있습니다. 주기적인 경영 효율성 지표 분석과 전문가 네트워킹으로 보안 정보를 확보하세요.'
  },
  P9: {
    name: '디지털 헬스케어 선구자',
    emoji: '🤖',
    tagline: '테크놀로지로 완성하는 차세대 진료의 미래',
    tags: ['시스템형', '도심', '장비중심'],
    dna: '최첨단 장비와 디지털 웨어러블 데이터를 분석하여 과학적이고 미래지향적인 진료를 선도하는 테크형 모델입니다.',
    strategy: '공상과학 영화 같은 미래지향적 인테리어와 대형 모니터 진단 관제실을 구축하세요. 환자에게 측정된 데이터를 가시적으로 보여주는 것이 핵심입니다.',
    marketing: '사이버 블루와 블랙 톤의 테크니컬한 이미지를 강조하고, 기술력을 앞세운 전문성 마케팅과 언론 홍보를 활용하세요.',
    risk: '장비 및 시스템 업그레이드 비용이 지속적으로 발생합니다. 기술 투자 비용 대비 수익성(ROI)을 꼼꼼히 관리하는 감각이 필요합니다.'
  },
  P10: {
    name: '지역 밀착 맘카페 멘토',
    emoji: '👶',
    tagline: '아이와 엄마의 마음을 가장 잘 아는 다정한 상담사',
    tags: ['원장중심', '거주지', '술기/보약'],
    dna: '편안한 상담실에서 환자와 다정한 소통을 나누며 지역 맘들의 든든한 멘토 역할을 수행하는 관계 중심형 모델입니다.',
    strategy: '유모차 동선이 편한 공간 설계와 영유아 전용 수유실/놀이방을 갖추세요. 가족 단위의 보험 진료와 보약 처방의 믹스가 수익의 핵심입니다.',
    marketing: '핑크와 베이지 톤의 따뜻한 브랜딩을 활용하고, 맘카페와의 지속적인 소통 및 건강 정보를 제공하는 인플루언서 전략을 사용하세요.',
    risk: '커뮤니티 내의 부정적 평판 전파 속도가 매우 빠릅니다. 친절함을 유지하되 의료적 원칙을 명확히 고수하여 전문성 시비를 방지하세요.'
  },
  P11: {
    name: '퍼포먼스 마케팅 집중형',
    emoji: '📢',
    tagline: '압도적 노출과 트렌디한 감각으로 시장을 장악하는 모델',
    tags: ['시스템형', '도심', '보험/일반'],
    dna: '강력한 온라인 노출과 트렌디한 비주얼로 젊은 환자들을 폭발적으로 유입시키는 마케팅 엔진형 모델입니다.',
    strategy: '로비 내 셀카 존이나 브랜드 굿즈 등 젊은 층이 SNS에 자랑하고 싶어 할 만한 트렌디한 공간과 상품을 기획하세요.',
    marketing: '레드와 실버 톤의 감각적인 디자인을 사용하고, 숏폼 영상 제작이나 파격적인 이벤트 등 노출 중심의 퍼포먼스 마케팅에 올인하세요.',
    risk: '마케팅 비용이 줄어들면 유입이 급감합니다. 유입된 환자들을 데이터화하여 재방문으로 이끄는 CRM 최적화 없이는 밑 빠진 독에 물 붓기가 될 수 있습니다.'
  },
  P12: {
    name: '고부가가치 VIP 클리닉',
    emoji: '👑',
    tagline: '소수 정예를 위한 최상의 품격과 맞춤형 케어',
    tags: ['원장중심', '도심', '비급여 특화'],
    dna: '호텔 같은 고급 대기실과 프라이빗한 상담실에서 상위 1% 소수 정예 환자를 진료하는 하이엔드 서비스 모델입니다.',
    strategy: '프라이빗 룸 중심의 공간 구성과 전담 케어 정무 코디네이터를 배치하세요. 명품의 격에 맞는 정밀 유전자 진단이나 고단가 특화 프로그램을 구성합니다.',
    marketing: '블랙과 골드 톤의 럭셔리한 브랜딩을 활용하고, 일반 검색 광고보다는 소개 중심의 회원제 클럽 방식 마케팅이나 커뮤니티 협업에 집중하세요.',
    risk: '진입 장벽은 높지만 이탈 시 타격이 큽니다. 환자 한 명 한 명의 세밀한 기호와 선호도를 기록하고 관리하는 최정예 상담 데이터가 필수입니다.'
  }
};

// ─────────────────────────────────────────
// PRESCRIPTIONS (Route B: 15가지 조합)
// ─────────────────────────────────────────
const prescriptions = {
  get(weakAreas) {
    // 최하위 2개 영역으로 처방전 매칭
    const key = weakAreas.sort().join('+');
    return prescriptionData[key] || prescriptionData['default'];
  }
};

const prescriptionData = {
  'CS+마케팅': {
    title: 'CS·마케팅 동시 강화 처방',
    desc: '신규 환자 유입도 부족하고, 기존 환자 경험도 아직 설계되지 않은 상태입니다. 마케팅으로 환자를 유치하기 전에 CS 시스템을 먼저 구축해야 광고비 낭비를 막을 수 있습니다.',
    steps: [
      { title: '1단계 (1개월): CS 기반 구축', desc: '초진·재진 응대 스크립트 제작, 직원 CS 교육 1회 실시, 환자 불만 접수 채널 개설 (카카오 채널)' },
      { title: '2단계 (2~3개월): 마케팅 기반 정비', desc: '네이버 플레이스 최적화, 블로그 주 2회 포스팅 체계 구축, 인스타그램 계정 개설 및 콘텐츠 캘린더 수립' },
      { title: '3단계 (4~6개월): 통합 성장 캠페인', desc: 'CS 품질 담보 후 광고 집행 시작, CS 만족 환자의 후기 작성 유도 시스템 연계' }
    ]
  },
  'CS+HR': {
    title: 'CS·HR 내부 역량 강화 처방',
    desc: '직원 시스템이 불안정하면 CS 품질도 일관되기 어렵습니다. 인사 체계와 서비스 교육을 동시에 정비하여 내부 경쟁력을 강화해야 합니다.',
    steps: [
      { title: '1단계: 직원 R&R 명확화', desc: '각 직원별 업무 기술서 작성, 평가 기준 및 KPI 수립, 주간 팀 미팅 제도화' },
      { title: '2단계: CS 교육 체계 구축', desc: '서비스 교육 매뉴얼 제작, 월 1회 정기 교육 시행, 우수 직원 포상 제도 도입' },
      { title: '3단계: 채용·온보딩 개선', desc: '신규 직원 2주 온보딩 프로그램, 멘토-멘티 제도 도입, 직원 만족도 분기 설문 실시' }
    ]
  },
  'CS+진료': {
    title: 'CS·진료 품질 동반 향상 처방',
    desc: '치료 효과와 서비스 경험이 모두 표준화되어야 환자 만족도와 재방문율이 올라갑니다. 진료 프로토콜과 서비스 설계를 함께 정비하세요.',
    steps: [
      { title: '1단계: 진료 표준화', desc: '주력 질환별 치료 프로토콜 3종 문서화, 초진 진료 로드맵 설명 표준화, 치료 성과 측정 지표 설정' },
      { title: '2단계: CS 연계 설계', desc: '치료 단계별 안내 멘트 스크립트화, 치료 경과 공유 프로세스 구축, 완료 환자 후기 수집 체계 마련' },
      { title: '3단계: 통합 품질 관리', desc: '월별 치료 효과 데이터 분석, CS 만족도와 재방문율 상관관계 추적' }
    ]
  },
  'CS+CRM': {
    title: 'CS·CRM 환자 경험 설계 처방',
    desc: '환자 경험의 시작(CS)과 끝(CRM)이 모두 미흡한 상태입니다. 초진부터 장기 관리까지 전 여정을 재설계해야 합니다.',
    steps: [
      { title: '1단계: 고객 여정 맵 작성', desc: '초진→재진→완료→이탈 단계별 환자 경험 요소 매핑, 개선 우선순위 도출' },
      { title: '2단계: CS 개선 + CRM 시스템 도입', desc: '감동 서비스 포인트 3개 설계, EMR 기반 환자 이력 관리 강화, 생일·기념일 자동 문자 발송 설정' },
      { title: '3단계: 재방문 유도 자동화', desc: '치료 완료 4주 후 추적 문자 발송, 3개월 부재 환자 재활성화 캠페인 월 1회 시행' }
    ]
  },
  'CS+비전': {
    title: 'CS·비전 기반 체계화 처방',
    desc: '서비스 품질의 일관성을 확보하지 못한 채 성장 전략을 추진하면 고객 이탈이 발생합니다. CS를 먼저 정비하고, 이를 바탕으로 성장 전략을 수립하세요.',
    steps: [
      { title: '1단계: CS 기준점 수립', desc: '현재 CS 수준 환자 설문 측정, 목표 NPS 설정, 월별 CS 개선 계획 수립' },
      { title: '2단계: 성장 비전 재설계', desc: 'CS 품질 기반의 브랜드 스토리 재정립, 1·3·5년 로드맵 수립 (CS 지표 연동)' },
      { title: '3단계: CS 기반 스케일업', desc: 'CS 품질 매뉴얼화 후 분원 확장 가능성 검토, 프랜차이즈/멀티 원장 모델 설계' }
    ]
  },
  '마케팅+HR': {
    title: '마케팅·HR 성장 인프라 구축 처방',
    desc: '마케팅으로 환자는 늘릴 수 있지만, 직원 역량이 받쳐주지 못하면 환자 경험이 무너집니다. 두 축을 동시에 강화해야 합니다.',
    steps: [
      { title: '1단계: 채용·교육 기반 마련', desc: '현 직원 역량 평가 후 교육 계획 수립, 마케팅 담당자 채용 또는 외주 파트너 선정' },
      { title: '2단계: 마케팅 채널 최적화', desc: '매출 기여도 분석 후 상위 2개 채널 집중 투자, 콘텐츠 제작 외주 또는 내부 담당자 지정' },
      { title: '3단계: 성장 인프라 완성', desc: '직원 인센티브와 마케팅 KPI 연동, 신환 유입→직원 응대→재방문의 선순환 구조 설계' }
    ]
  },
  '마케팅+진료': {
    title: '마케팅·진료 차별화 전략 처방',
    desc: '진료 결과물이 강력해야 마케팅이 살아납니다. 치료 성과를 데이터화하고, 이를 마케팅 콘텐츠로 전환하는 전략이 핵심입니다.',
    steps: [
      { title: '1단계: 진료 성과 데이터화', desc: '주력 질환 치료 전·후 사례 10건 수집, 통증 수치·ROM 개선 등 객관적 지표 기록' },
      { title: '2단계: 성과 기반 콘텐츠 제작', desc: '실제 사례 기반 블로그·SNS 콘텐츠 작성, 전문성 입증 유튜브/쇼츠 기획' },
      { title: '3단계: 전문성 마케팅 캠페인', desc: '특화 질환 키워드 SEO 집중 공략, 커뮤니티 내 전문가 Q&A 활동 활성화' }
    ]
  },
  '마케팅+CRM': {
    title: '마케팅·CRM 환자 생애주기 관리 처방',
    desc: '새 환자를 유입하는 것만큼 기존 환자를 붙잡아두는 것이 중요합니다. 신환 유입과 기존 환자 관리를 동시에 최적화해야 합니다.',
    steps: [
      { title: '1단계: CRM 기반 구축', desc: '환자 DB 정비 및 세그먼트 분류 (초진/재진/장기/휴면), 기본 CRM 도구 도입 (카카오 채널, SMS 시스템)' },
      { title: '2단계: 마케팅-CRM 연계', desc: '신환 유입 채널 최적화, 첫 방문 후 7·30·90일 자동 팔로업 시스템 구축' },
      { title: '3단계: 리텐션 캠페인', desc: '휴면 환자 재활성화 캠페인 월 1회, 장기 환자 감사 이벤트 분기 1회, 추천 프로그램 운영' }
    ]
  },
  '마케팅+비전': {
    title: '마케팅·비전 브랜드 성장 전략 처방',
    desc: '명확한 성장 비전 없이 마케팅을 집행하면 방향성 없는 비용 낭비가 됩니다. 중장기 브랜드 전략과 마케팅을 정렬시켜야 합니다.',
    steps: [
      { title: '1단계: 브랜드 비전 수립', desc: '3년 후 한의원의 모습 구체화, 핵심 타겟 환자군 재정의, 브랜드 핵심 메시지 3가지 도출' },
      { title: '2단계: 전략적 마케팅 수립', desc: '비전 달성을 위한 마케팅 로드맵 수립, 채널별 역할 정의 (인지/고려/전환/유지)' },
      { title: '3단계: 스케일업 준비', desc: '분원 또는 브랜드 확장을 위한 마케팅 자산 구축 (브랜드 가이드라인, 콘텐츠 라이브러리)' }
    ]
  },
  'HR+진료': {
    title: 'HR·진료 내부 시스템 완성 처방',
    desc: '진료의 품질과 직원의 역량은 불가분의 관계입니다. 탁월한 진료 시스템이 직원 업무 효율을 높이고, 우수한 직원이 진료 시스템을 완성합니다.',
    steps: [
      { title: '1단계: 진료 보조 업무 표준화', desc: '간호조무사·코디네이터의 진료 지원 프로세스 문서화, 역할 분담 최적화' },
      { title: '2단계: 진료팀 교육 체계', desc: '주력 질환 이해 교육 직원 대상 실시, 진료 흐름 시뮬레이션 훈련' },
      { title: '3단계: 성과 연계 시스템', desc: '진료 효율 지표와 직원 평가 연동, 우수 성과 공유 문화 형성' }
    ]
  },
  'HR+CRM': {
    title: 'HR·CRM 환자 관리 역량 강화 처방',
    desc: '환자 관리는 시스템만큼 사람이 중요합니다. CRM 도구를 도입하되, 이를 실행할 직원의 역량을 함께 키워야 효과가 납니다.',
    steps: [
      { title: '1단계: CRM 담당자 지정', desc: '환자 관리 전담 직원 또는 코디네이터 지정, CRM 도구 사용 교육 실시' },
      { title: '2단계: 환자 관리 프로세스 설계', desc: '재방문 유도 스크립트 작성, 환자별 맞춤 소통 기준 수립' },
      { title: '3단계: 자동화 + 사람의 조화', desc: '자동 발송 시스템으로 루틴 관리, 중요 환자(장기/고단가)는 담당자 개인 케어 병행' }
    ]
  },
  'HR+비전': {
    title: 'HR·비전 조직 문화 기반 성장 처방',
    desc: '성장하는 조직은 명확한 비전과 이를 실현할 사람이 있습니다. 직원들이 비전을 공유하고 함께 성장하는 문화를 만드는 것이 핵심입니다.',
    steps: [
      { title: '1단계: 비전 공유 워크숍', desc: '원장님의 3~5년 비전을 직원과 공유, 직원별 기여 방향 설정, 팀 공동 목표 수립' },
      { title: '2단계: 성장 지원 제도 도입', desc: '직원 교육비 지원 제도, 내부 승진 경로 설계, 성과급 및 인센티브 구조 개선' },
      { title: '3단계: 핵심 인재 확보 전략', desc: '분원 관리자 양성 프로그램, 파트너 원장 채용 전략 수립' }
    ]
  },
  '진료+CRM': {
    title: '진료·CRM 치료 성과 관리 처방',
    desc: '좋은 치료 결과를 장기 관계로 연결하지 못하면 성과가 묻힙니다. 진료 데이터를 CRM과 연계하여 환자의 재방문과 소개를 체계적으로 유도해야 합니다.',
    steps: [
      { title: '1단계: 치료 성과 기록 체계화', desc: '초진-치료 중-완료 단계별 성과 기록 표준화, EMR 입력 항목 최적화' },
      { title: '2단계: 성과 기반 CRM 연계', desc: '치료 완료 후 성과 공유 메시지 발송, 사후 관리 프로그램 제안 자동화' },
      { title: '3단계: 재방문·소개 유도', desc: '정기 점검 프로그램 설계, 완치 환자 소개 리퍼럴 인센티브 운영' }
    ]
  },
  '진료+비전': {
    title: '진료·비전 전문성 브랜드 구축 처방',
    desc: '탁월한 진료 역량을 외부에 알리고 성장 전략으로 연결해야 합니다. 진료 전문성이 비전의 핵심 자산이 되도록 설계하세요.',
    steps: [
      { title: '1단계: 핵심 전문 역량 정의', desc: '가장 강점이 있는 진료 분야 1~2개 선정, 치료 철학과 접근법 문서화' },
      { title: '2단계: 전문성 기반 비전 수립', desc: '전문 분야 기반 3~5년 성장 로드맵 수립, 학술 활동·강의·방송 계획 포함' },
      { title: '3단계: 스케일업 설계', desc: '전문 분야 분원 확장 또는 교육 사업 모델 검토, 퍼스널 브랜딩과 병원 브랜드 연계 전략' }
    ]
  },
  'CRM+비전': {
    title: 'CRM·비전 지속 성장 시스템 처방',
    desc: '환자 자산(CRM 데이터)을 기반으로 성장 전략을 수립해야 합니다. 기존 환자 데이터가 미래 성장의 가장 강력한 자산입니다.',
    steps: [
      { title: '1단계: 환자 DB 자산화', desc: '전체 환자 DB 정비, 세그먼트 분류, LTV(환자 생애가치) 분석 시작' },
      { title: '2단계: CRM 기반 성장 지표 설정', desc: '재방문율, 이탈률, LTV를 비전 달성 핵심 지표로 설정, 대시보드 구축' },
      { title: '3단계: CRM 자산 기반 확장 전략', desc: '충성 환자 기반 분원 오픈 타당성 검토, 기존 환자 대상 신규 서비스 론칭 전략' }
    ]
  },
  'default': {
    title: '종합 경영 시스템 강화 처방',
    desc: '전 영역에 걸친 균형적 강화가 필요합니다. 우선순위를 정하여 단계적으로 접근하세요.',
    steps: [
      { title: '1단계: 현황 정밀 진단', desc: '각 영역별 현재 수준 수치화, 가장 빠른 개선이 가능한 영역 우선 선정' },
      { title: '2단계: 핵심 2개 영역 집중', desc: '선정된 영역에 3개월간 집중 투자, 목표 지표 달성 후 다음 영역으로 이동' },
      { title: '3단계: 전사 통합 관리', desc: '영역 간 시너지 설계, 통합 경영 대시보드 구축, 분기별 경영 리뷰 정례화' }
    ]
  }
};

// ─────────────────────────────────────────
// EFFICIENCY LOGIC (Route B)
// ─────────────────────────────────────────
function calcEfficiency(revenueVal, visitorsVal) {
  const revenueMap = { r1: 2500, r2: 4000, r3: 6500, r4: 9000 };
  const visitorsMap = { v1: 15, v2: 30, v3: 50, v4: 70 };
  const revenue = revenueMap[revenueVal] || 4000;
  const visitors = visitorsMap[visitorsVal] || 30;
  const perVisitor = revenue / (visitors * 22); // 만원/명
  if (perVisitor >= 10) return 'high';
  if (perVisitor >= 6) return 'mid';
  return 'low';
}

const efficiencyText = {
  high: {
    badge: '운영 효율 높음',
    color: 'eff-high',
    icon: '▲',
    comment: `현재 내원객 대비 매출 효율이 업계 상위 수준입니다. 환자 1인당 객단가가 충분히 확보되어 있으며, 비급여 또는 프로그램 전환율이 양호한 것으로 분석됩니다. 지금의 수익 구조를 유지하면서 신환 유입량을 늘리는 마케팅 투자가 가장 효과적인 성장 전략입니다.`
  },
  mid: {
    badge: '운영 효율 보통',
    color: 'eff-mid',
    icon: '→',
    comment: `현재 효율은 업계 평균 수준입니다. 내원객 수는 적정하나, 객단가를 높일 여지가 있습니다. 비급여 프로그램 추가 또는 탕약·패키지 전환율을 높이는 진료 상담 프로세스 개선이 매출 향상의 핵심 레버가 될 것입니다.`
  },
  low: {
    badge: '운영 효율 개선 필요',
    color: 'eff-low',
    icon: '▼',
    comment: `현재 내원객 수 대비 매출 효율이 낮은 편입니다. 환자 수를 늘리기 전에 객단가와 진료 구성을 먼저 점검해야 합니다. 진료 단가 최적화, 비급여 도입 또는 확대, 불필요한 보험 진료 비중 조정 등 수익 구조 개선이 시급합니다.`
  }
};

// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────
let currentScreen = 'screen-splash';

function goToScreen(id) {
  const current = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next || id === currentScreen) return;
  current.classList.remove('active');
  current.classList.add('exit');
  setTimeout(() => current.classList.remove('exit'), 400);
  next.classList.add('active');
  next.style.transform = 'translateX(30px)';
  setTimeout(() => { next.style.transform = ''; }, 10);
  currentScreen = id;
}

function goToForm() { goToScreen('screen-form'); }

// ─────────────────────────────────────────
// FORM
// ─────────────────────────────────────────
function toggleConsent(id) {
  const el = document.getElementById(id);
  el.classList.toggle('checked');
  if (id === 'c1') state.consent1 = el.classList.contains('checked');
  if (id === 'c2') state.consent2 = el.classList.contains('checked');
}

function formatPhone(v) {
  const d = v.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 7) return d.slice(0, 3) + '-' + d.slice(3);
  return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7, 11);
}

document.getElementById('input-phone').addEventListener('input', function () {
  this.value = formatPhone(this.value);
});

// ─────────────────────────────────────────
// INPUT FIELD AUTO-FOCUS
// ─────────────────────────────────────────
function handleNameKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('input-phone').focus();
  }
}

function handlePhoneKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const phone = document.getElementById('input-phone').value;
    if (phone.length >= 12) {
      document.getElementById('input-email').focus();
    }
  }
}

function handleEmailKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const email = document.getElementById('input-email').value;
    if (email.includes('@')) {
      // Scroll to consent area
      document.querySelector('.consent-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function submitForm() {
  const name = document.getElementById('input-name').value.trim();
  const phone = document.getElementById('input-phone').value.trim();
  const email = document.getElementById('input-email').value.trim();
  if (!name) { showToast('성함을 입력해 주세요'); return; }
  if (phone.length < 12) { showToast('연락처를 정확히 입력해 주세요'); return; }
  if (!email.includes('@')) { showToast('이메일을 정확히 입력해 주세요'); return; }
  if (!state.consent1) { showToast('개인정보 수집 동의가 필요합니다'); return; }
  state.name = name; state.phone = phone; state.email = email;
  sendToSheet({ name, phone, email, consent1: true, consent2: state.consent2, step: '정보입력완료' });
  goToScreen('screen-branch');
}

async function sendToSheet(data) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() })
    });
  } catch (e) { /* silent */ }
}

// ─────────────────────────────────────────
// ROUTE A
// ─────────────────────────────────────────
let currentQuestions = [];
let questionIndex = 0;
let selectedOption = null;

function startRouteA() {
  state.route = 'A';
  state.answers = [];
  currentQuestions = questionsA;
  questionIndex = 0;
  renderQuestion();
  goToScreen('screen-question');
}

function renderQuestion() {
  const q = currentQuestions[questionIndex];
  if (!q) { finishQuestions(); return; }

  const total = currentQuestions.length;
  const pct = (questionIndex / total) * 100;
  document.getElementById('q-progress-fill').style.width = pct + '%';
  document.getElementById('q-progress-label').textContent = state.route === 'A' ? '개원 DNA 진단' : '경영 밸런스 진단';
  document.getElementById('q-progress-fraction').textContent = `${questionIndex + 1} / ${total}`;
  document.getElementById('q-area-label').textContent = q.area;
  document.getElementById('q-num-label').textContent = q.num;
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-sub').textContent = q.sub || '';

  selectedOption = state.answers[questionIndex] ?? null;

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  if (q.type === 'choice') {
    q.options.forEach((opt, i) => {
      const isB = state.route === 'B';
      const div = document.createElement('div');
      div.className = 'option-item' + (selectedOption === opt.val ? (isB ? ' selected-b' : ' selected') : '');
      div.innerHTML = `
        <div class="option-dot"></div>
        <div class="option-content">
          <div class="option-label">${opt.label}</div>
          ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
        </div>`;
      div.onclick = () => selectOption(opt.val, i);
      container.appendChild(div);
    });
  } else if (q.type === 'scale') {
    const labels = ['매우 낮음', '낮음', '보통', '높음', '매우 높음'];
    const scaleRow = document.createElement('div');
    scaleRow.className = 'scale-options';
    for (let s = 1; s <= 5; s++) {
      const btn = document.createElement('div');
      btn.className = 'scale-btn' + (selectedOption === s ? ' selected' : '');
      btn.innerHTML = `<div class="scale-num">${s}</div><div class="scale-lbl">${labels[s - 1]}</div>`;
      btn.onclick = () => selectScale(s);
      scaleRow.appendChild(btn);
    }
    const labelRow = document.createElement('div');
    labelRow.className = 'scale-labels';
    labelRow.innerHTML = '<span>전혀 없음</span><span>완전히 갖춤</span>';
    container.appendChild(scaleRow);
    container.appendChild(labelRow);
  } else if (q.type === 'text_input') {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'goal-input';
    inp.placeholder = q.placeholder || '';
    inp.value = state.bMetrics.goal || '';
    inp.oninput = (e) => { state.bMetrics.goal = e.target.value; selectedOption = e.target.value; };
    container.appendChild(inp);
    selectedOption = state.bMetrics.goal || null;
    setTimeout(() => inp.focus(), 100);
  }
}

function selectOption(val, idx) {
  selectedOption = val;
  const items = document.querySelectorAll('.option-item');
  const isB = state.route === 'B';
  items.forEach((el, i) => {
    el.classList.remove('selected', 'selected-b');
    if (i === idx) el.classList.add(isB ? 'selected-b' : 'selected');
  });
  // auto-advance after short delay
  setTimeout(() => nextQuestion(), 300);
}

function selectScale(val) {
  selectedOption = val;
  document.querySelectorAll('.scale-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 === val);
  });
  setTimeout(() => nextQuestion(), 300);
}

function nextQuestion() {
  if (selectedOption === null || selectedOption === '') {
    showToast('항목을 선택해 주세요'); return;
  }
  state.answers[questionIndex] = selectedOption;

  // Store B metrics
  const q = currentQuestions[questionIndex];
  if (state.route === 'B' && questionIndex < 2) {
    if (questionIndex === 0) state.bMetrics.revenue = selectedOption;
    if (questionIndex === 1) state.bMetrics.visitors = selectedOption;
  }

  questionIndex++;
  selectedOption = state.answers[questionIndex] ?? null;
  if (questionIndex >= currentQuestions.length) { finishQuestions(); return; }
  renderQuestion();
}

function goBackQuestion() {
  if (questionIndex === 0) {
    goToScreen('screen-branch');
  } else {
    questionIndex--;
    selectedOption = state.answers[questionIndex] ?? null;
    renderQuestion();
  }
}

function finishQuestions() {
  goToScreen('screen-loading');
  setTimeout(() => generateReport(), 2500);
}

// ─────────────────────────────────────────
// ROUTE B
// ─────────────────────────────────────────
function startRouteB() {
  state.route = 'B';
  state.answers = [];
  state.bMetrics = { revenue: '', visitors: '', goal: '' };
  currentQuestions = [...questionsB_basic, ...questionsB_scale.map(q => ({ ...q, type: 'scale' }))];
  questionIndex = 0;
  renderQuestion();
  goToScreen('screen-question');
}

// ─────────────────────────────────────────
// GENERATE REPORT
// ─────────────────────────────────────────
function generateReport() {
  const container = document.getElementById('report-container');

  if (state.route === 'A') {
    const personaKey = personas.getPersona(state.answers);
    const p = personaData[personaKey] || personaData['B3'];
    container.innerHTML = buildReportA(p, personaKey);
    sendToSheet({ ...state, route: 'A', persona: personaKey, step: '리포트완료' });
  } else {
    // Calc B scores
    const scaleAnswers = state.answers.slice(3); // skip 3 basic
    const scores = {};
    areasB.forEach(a => scores[a] = []);
    questionsB_scale.forEach((q, i) => {
      scores[q.areaKey].push(Number(scaleAnswers[i]) || 3);
    });
    const avgScores = {};
    areasB.forEach(a => {
      const arr = scores[a];
      avgScores[a] = arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 3;
    });
    const sorted = areasB.slice().sort((a, b) => avgScores[a] - avgScores[b]);
    const weakTwo = [sorted[0], sorted[1]];
    const eff = calcEfficiency(state.bMetrics.revenue, state.bMetrics.visitors);
    const rx = prescriptions.get(weakTwo);
    container.innerHTML = buildReportB(avgScores, weakTwo, eff, rx);
    sendToSheet({ ...state, route: 'B', weakAreas: weakTwo.join('+'), efficiency: eff, step: '리포트완료' });
  }

  goToScreen('screen-report');
}

// ─────────────────────────────────────────
// REPORT A HTML
// ─────────────────────────────────────────
function buildReportA(p, personaKey) {
  const num = personaKey.replace('P', '');
  const imgPath = `images/persona_a${num}.png`;

  return `
  <div class="report-hero">
    <div class="report-type">개원 DNA 진단 리포트</div>
    <div class="report-persona">${p.emoji} ${p.name}</div>
    <div class="report-tagline">${p.tagline}</div>
    <div class="report-tags">
      ${p.tags.map(t => `<span class="report-tag">${t}</span>`).join('')}
    </div>
    <div class="report-img-container">
      <img src="${imgPath}" class="report-main-img" alt="${p.name}" onerror="this.style.display='none'">
    </div>
  </div>
  <div class="report-body">
    <div class="report-section">
      <div class="section-label">DNA 상세 분석</div>
      <div class="section-title">귀원의 개원 DNA 유형</div>
      <div class="section-body">${p.dna}</div>
    </div>
    <div class="report-section">
      <div class="section-label">입지 · 타겟 전략</div>
      <div class="section-title">최적 입지 및 환자 전략</div>
      <div class="section-body">${p.strategy.replace(/\n/g, '<br>')}</div>
    </div>
    <div class="report-section">
      <div class="section-label">초기 마케팅 로드맵</div>
      <div class="section-title">6개월 마케팅 실행 계획</div>
      <div class="section-body">${p.marketing.replace(/\n/g, '<br>')}</div>
      <div class="highlight-box">핵심 전략: 처음 3개월은 네이버 플레이스와 블로그 SEO에 집중하세요. 광고보다 유기적 신뢰가 먼저입니다.</div>
    </div>
    <div class="report-section">
      <div class="section-label">리스크 제언</div>
      <div class="section-title">주의해야 할 경영 리스크</div>
      <div class="section-body">${p.risk}</div>
      <div class="risk-box">한가온컴퍼니의 전문 컨설턴트가 귀원의 개원 전략을 1:1로 정밀 설계해 드립니다.</div>
    </div>
    <div class="report-divider"></div>
  </div>
  <div class="report-footer">
    <button class="save-btn" onclick="saveReport()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      진단 리포트 이미지 저장
    </button>
    <button class="restart-btn" onclick="restartAll()">처음으로 돌아가기</button>
  </div>`;
}

// ─────────────────────────────────────────
// REPORT B HTML
// ─────────────────────────────────────────
function buildReportB(avgScores, weakTwo, eff, rx) {
  const effInfo = efficiencyText[eff];

  // Radar SVG
  const cx = 130, cy = 130, r = 90;
  const pts = areasB.map((a, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const sc = avgScores[a];
    const ratio = sc / 5;
    return { x: cx + Math.cos(angle) * r * ratio, y: cy + Math.sin(angle) * r * ratio, label: a, score: sc };
  });
  const gridPts = (ratio) => areasB.map((a, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${cx + Math.cos(angle) * r * ratio},${cy + Math.sin(angle) * r * ratio}`;
  }).join(' ');
  const labelPts = areasB.map((a, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * (r + 22), y: cy + Math.sin(angle) * (r + 22), label: a };
  });
  const dataPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  const radarSVG = `
  <svg viewBox="0 0 260 260" width="260" height="260" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${gridPts(1)}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <polygon points="${gridPts(0.8)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    <polygon points="${gridPts(0.6)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    <polygon points="${gridPts(0.4)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    <polygon points="${gridPts(0.2)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    ${areasB.map((a, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(angle) * r}" y2="${cy + Math.sin(angle) * r}" stroke="rgba(255,255,255,0.07)" stroke-width="0.5"/>`;
  }).join('')}
    <path d="${dataPath}" fill="rgba(78,205,196,0.15)" stroke="#4ECDC4" stroke-width="2"/>
    ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#4ECDC4"/>`).join('')}
    ${labelPts.map(p => `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#9CA8BC" font-family="Noto Sans KR">${p.label}</text>`).join('')}
  </svg>`;

  const barColors = {
    high: '#4ECDC4',
    mid: '#C9A96E',
    low: '#E8826B'
  };

  const scoreItems = areasB.map(a => {
    const sc = avgScores[a];
    const pct = (sc / 5) * 100;
    const color = sc >= 4 ? barColors.high : sc >= 2.5 ? barColors.mid : barColors.low;
    const isWeak = weakTwo.includes(a);
    return `
    <div class="score-item">
      <div class="score-header">
        <span class="score-name">${a}${isWeak ? ' ⚠️' : ''}</span>
        <span class="score-val">${sc.toFixed(1)} / 5.0</span>
      </div>
      <div class="score-track"><div class="score-bar" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  }).join('');

  const rxSteps = rx.steps.map((s, i) => `
    <div class="rx-step">
      <div class="rx-num">${i + 1}</div>
      <div class="rx-content">
        <div class="rx-title">${s.title}</div>
        <div class="rx-desc">${s.desc}</div>
      </div>
    </div>`).join('');

  const revenueLabel = { r1: '3천만원 미만', r2: '3천~5천만원', r3: '5천~8천만원', r4: '8천만원 이상' };
  const visitorsLabel = { v1: '20명 미만', v2: '20~40명', v3: '40~60명', v4: '60명 이상' };

  return `
  <div class="report-hero">
    <div class="report-type">경영 밸런스 진단 리포트</div>
    <div class="report-persona">📊 ${state.name} 원장님의 경영 진단</div>
    <div class="report-tagline">6개 핵심 영역 종합 분석 결과</div>
    <div class="report-tags">
      <span class="report-tag">월매출 ${revenueLabel[state.bMetrics.revenue] || '-'}</span>
      <span class="report-tag">일 내원 ${visitorsLabel[state.bMetrics.visitors] || '-'}</span>
      <span class="report-tag">목표 ${state.bMetrics.goal || '미입력'}</span>
    </div>
  </div>
  <div class="report-body">

    <div class="report-section">
      <div class="section-label">운영 효율 진단</div>
      <div class="section-title">매출 대비 운영 효율 분석</div>
      <div class="efficiency-badge ${effInfo.color}">${effInfo.icon} ${effInfo.badge}</div>
      <div class="section-body">${effInfo.comment}</div>
    </div>

    <div class="report-section">
      <div class="section-label">방사형 밸런스 차트</div>
      <div class="section-title">6개 영역 경영 레이더</div>
      <div class="radar-wrap">${radarSVG}</div>
      <div class="score-list">${scoreItems}</div>
    </div>

    <div class="report-section">
      <div class="section-label">취약 영역 정밀 분석</div>
      <div class="section-title">⚠️ ${weakTwo.join(' · ')} 영역 집중 진단</div>
      <div class="section-body">${rx.desc}</div>
      <div class="risk-box">이 두 영역의 점수가 전체 평균을 하회하며, 경영 성과에 가장 직접적인 영향을 미치고 있습니다.</div>
    </div>

    <div class="report-section">
      <div class="section-label">3단계 개선 솔루션</div>
      <div class="section-title">${rx.title}</div>
      <div class="rx-card">${rxSteps}</div>
      <div class="highlight-box">6개월 내 집중 실행 시 매출 15~30% 개선이 기대됩니다. 한가온컴퍼니 전문 컨설턴트가 단계별 실행을 지원합니다.</div>
    </div>
    <div class="report-divider"></div>
  </div>
  <div class="report-footer">
    <button class="save-btn" onclick="saveReport()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      진단 리포트 이미지 저장
    </button>
    <button class="restart-btn" onclick="restartAll()">처음으로 돌아가기</button>
  </div>`;
}


// ─────────────────────────────────────────
// REPORT A HTML
// ─────────────────────────────────────────
function getAnswersSummaryA() {
  const labels = [
    { q: '의원 규모', map: { 'S': '소형', 'M': '중형', 'L': '대형' } },
    { q: '입원실 운영', map: { 'no': '운영 계획 없음', 'maybe': '향후 확장 검토', 'yes': '처음부터 포함' } },
    { q: '시설 투자', map: { 'low': '최소 투자형', 'mid': '표준 투자형', 'high': '프리미염 투자형' } },
    { q: '상권 선택', map: { 'residential': '주거 밀집', 'urban': '도심/역세권', 'medical': '의료복합' } },
    { q: '주력 환자군', map: { 'kids': '영유아·소아', 'young': '청년/직장인', 'senior': '고령층/만성질환' } },
    { q: '마케팅 채널', map: { 'online': '온라인 중심', 'offline': '오프라인 중심', 'review': '리뷰/입소문' } },
    { q: '수익 모델', map: { 'insurance': '보험일반', 'mixed': '혼합형', 'premium': '비급여특화' } },
    { q: '진료 특화', map: { 'treatment': '술기/침구', 'herbal': '보약/한약', 'program': '프로그램/장비' } },
    { q: '브랜딩', map: { 'specialist': '전문성', 'gp': '신뢰성', 'premium': '프리미엄' } }
  ];

  let html = '<div class="responses-box">';
  labels.forEach((item, i) => {
    const answer = state.answers[i] || '';
    const displayValue = item.map[answer] || answer || '미응답';
    html += `<div class="response-item">
      <div class="response-q">${item.q}</div>
      <div class="response-a">${displayValue}</div>
    </div>`;
  });
  html += '</div>';
  return html;
}
// ─────────────────────────────────────────
// SAVE REPORT AS IMAGE
// ─────────────────────────────────────────
function saveReport() {
  const reportElement = document.getElementById('report-container');
  if (!reportElement) return;

  showToast('이미지 생성 중...');

  html2canvas(reportElement, {
    backgroundColor: '#0A0E1A',
    scale: 2,
    useCORS: true,
    logging: false,
    width: reportElement.offsetWidth,
    height: reportElement.offsetHeight,
    windowWidth: reportElement.scrollWidth,
    windowHeight: reportElement.scrollHeight,
    x: 0,
    y: window.scrollY
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `진단리포트_${state.name || '한가온'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('리포트가 저장되었습니다!');
  }).catch(err => {
    showToast('이미지 저장에 실패했습니다.');
    console.error(err);
  });
}

function restartAll() {
  state.answers = [];
  state.bMetrics = { revenue: '', visitors: '', goal: '' };
  state.route = null;
  questionIndex = 0;
  selectedOption = null;
  document.getElementById('input-name').value = '';
  document.getElementById('input-phone').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('c1').classList.remove('checked');
  document.getElementById('c2').classList.remove('checked');
  state.consent1 = false; state.consent2 = false;
  goToScreen('screen-splash');
}

// Animate score bars after report renders
document.getElementById('screen-report').addEventListener('transitionend', () => {
  document.querySelectorAll('.score-bar').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = w; }, 100);
  });
});
