#!/bin/bash

# ============================================
# 배포 후 검증 체크리스트
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         배포 후 검증 체크리스트                  ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}각 항목을 테스트한 후 y/n으로 응답하세요.${NC}"
echo ""

PASS=0
FAIL=0
TOTAL=0

# 함수: 체크 항목
check_item() {
    local question="$1"
    TOTAL=$((TOTAL + 1))
    
    echo -e "${NC}${TOTAL}. ${question}${NC}"
    read -p "   테스트 완료? (y/n): " answer
    
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo -e "   ${GREEN}✅ 통과${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "   ${RED}❌ 실패${NC}"
        FAIL=$((FAIL + 1))
    fi
    echo ""
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 배포 확인 ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

check_item "GitHub Actions에서 배포 성공 (초록 체크)?"
check_item "사이트 접속 가능 (https://yoonjb83.github.io/hangaonco-kmex/)?"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 입력 필드 자동 포커스 ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

check_item "성함 입력 → Enter → 연락처 자동 포커스?"
check_item "연락처 입력 → 자동 포매팅 (010-0000-0000)?"
check_item "연락처 입력 → Enter → 이메일 자동 포커스?"
check_item "이메일 입력 → Enter → 동의서 영역 스크롤?"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 개원 진단 (Route A) ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

check_item "진단 완료 후 '귀원의 진단 응답' 섹션 표시 (9개 항목)?"
check_item "'DNA 상세 분석' 섹션에 분석 박스 표시?"
check_item "'월별 마케팅 실행 계획' 섹션 표시 (1~6월)?"
check_item "'다음 단계' 섹션 표시?"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 기개원 진단 (Route B) ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

check_item "'기본 정보' 메트릭 카드 표시 (3개)?"
check_item "'방사형 차트' 정상 표시 및 해석 포함?"
check_item "'실행 타임라인' 표시 (1개월, 3개월, 6개월)?"
check_item "'다음 단계' 섹션 표시?"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 리포트 저장 기능 ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

check_item "'진단 리포트 이미지 저장' 버튼 표시?"
check_item "버튼 클릭 시 PNG 파일 다운로드?"
check_item "파일명에 날짜/시간 포함 (hangaon-report_YYYYMMDD_HHMMSS.png)?"
check_item "다운로드된 이미지가 정상적으로 열림?"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ 검증 결과 ]${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PERCENT=$((PASS * 100 / TOTAL))

echo -e "총 테스트 항목: ${YELLOW}${TOTAL}${NC}"
echo -e "통과: ${GREEN}${PASS}${NC}"
echo -e "실패: ${RED}${FAIL}${NC}"
echo -e "통과율: ${CYAN}${PERCENT}%${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          🎉 모든 테스트 통과!                    ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}다음 단계:${NC}"
    echo -e "${NC}1. (선택) 도메인 변경 (hangaon-report)${NC}"
    echo -e "${NC}2. 마케팅 자료 업데이트${NC}"
    echo -e "${NC}3. QR코드 재생성${NC}"
elif [ $PERCENT -ge 80 ]; then
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║       ⚠️  일부 항목 확인 필요                    ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}실패한 항목을 다시 확인해주세요.${NC}"
    echo -e "${YELLOW}문제가 계속되면 '수정사항_적용_가이드.md'의${NC}"
    echo -e "${YELLOW}'문제 해결' 섹션을 참조하세요.${NC}"
else
    echo -e "${RED}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║         ❌ 배포 검증 실패                        ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}다음을 확인하세요:${NC}"
    echo -e "${YELLOW}1. 브라우저 캐시 초기화 (Ctrl+Shift+Delete)${NC}"
    echo -e "${YELLOW}2. 시크릿 창에서 테스트${NC}"
    echo -e "${YELLOW}3. GitHub Actions 배포 로그 확인${NC}"
    echo -e "${YELLOW}4. 브라우저 개발자 도구(F12) 콘솔 확인${NC}"
fi

echo ""
echo -e "${NC}자세한 내용: ${BLUE}수정사항_적용_가이드.md${NC}"
echo ""
read -p "Press Enter to exit..."
