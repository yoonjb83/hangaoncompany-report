#!/bin/bash

# ============================================
# 한가온컴퍼니 진단 플랫폼 배포 스크립트
# Mac/Linux Bash 전용
# ============================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   한가온컴퍼니 병의원 경영 정밀진단 배포 시작   ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# 1. 저장소 확인
echo -e "${YELLOW}📁 Step 1: 저장소 확인 중...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 오류: Git 저장소가 아닙니다.${NC}"
    echo -e "${RED}   이 스크립트는 프로젝트 루트 폴더에서 실행해야 합니다.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git 저장소 확인 완료${NC}"
echo ""

# 2. 변경사항 확인
echo -e "${YELLOW}📝 Step 2: 변경된 파일 확인 중...${NC}"
if [ -n "$(git status --short)" ]; then
    echo -e "${CYAN}변경된 파일:${NC}"
    git status --short
    echo ""
else
    echo -e "${YELLOW}⚠️  경고: 변경된 파일이 없습니다.${NC}"
    read -p "그래도 계속하시겠습니까? (y/n): " continue
    if [ "$continue" != "y" ]; then
        echo -e "${YELLOW}배포를 취소합니다.${NC}"
        exit 0
    fi
fi
echo ""

# 3. 스테이징
echo -e "${YELLOW}➕ Step 3: 파일 스테이징 중...${NC}"
git add .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 파일 스테이징 완료${NC}"
else
    echo -e "${RED}❌ 스테이징 실패${NC}"
    exit 1
fi
echo ""

# 4. 커밋
echo -e "${YELLOW}💾 Step 4: 커밋 생성 중...${NC}"
COMMIT_MESSAGE="Feat: 진단 리포트 기능 강화 및 UX 개선

- 보고서 저장 기능 개선 (고품질 PNG, 타임스탬프 파일명)
- 개원/기개원 리포트 내용 강화 (섹션 12개 추가)
- 입력 필드 자동 포커스 전환 기능 추가
- 신규 CSS 스타일 13개 추가
- 응답 데이터와 문항 매칭 명확화"

git commit -m "$COMMIT_MESSAGE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 커밋 생성 완료${NC}"
else
    echo -e "${YELLOW}⚠️  경고: 커밋할 변경사항이 없거나 커밋 실패${NC}"
fi
echo ""

# 5. 푸시
echo -e "${YELLOW}🚀 Step 5: GitHub에 푸시 중...${NC}"
echo -e "${GRAY}   (인증이 필요할 수 있습니다)${NC}"
git push origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 푸시 완료!${NC}"
else
    echo -e "${RED}❌ 푸시 실패${NC}"
    echo -e "${YELLOW}   다음을 확인하세요:${NC}"
    echo -e "${YELLOW}   - GitHub 인증 정보${NC}"
    echo -e "${YELLOW}   - 인터넷 연결${NC}"
    echo -e "${YELLOW}   - 저장소 권한${NC}"
    exit 1
fi
echo ""

# 6. 배포 완료
echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ 배포 완료!                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}다음 단계:${NC}"
echo -e "${NC}1. GitHub Actions에서 배포 상태 확인 (1~2분 소요)${NC}"
echo -e "${BLUE}   👉 https://github.com/yoonjb83/hangaonco-kmex/actions${NC}"
echo ""
echo -e "${NC}2. 배포 완료 후 사이트 접속:${NC}"
echo -e "${BLUE}   👉 https://yoonjb83.github.io/hangaonco-kmex/${NC}"
echo ""
echo -e "${NC}3. 새 기능 테스트 (5분)${NC}"
echo -e "${GRAY}   - 리포트 이미지 저장${NC}"
echo -e "${GRAY}   - 입력 필드 자동 포커스${NC}"
echo -e "${GRAY}   - 강화된 리포트 내용${NC}"
echo ""
echo -e "${NC}4. (선택) 도메인 변경 (5~10분)${NC}"
echo -e "${BLUE}   👉 GitHub_도메인_변경_가이드.md 참조${NC}"
echo ""

# macOS에서 브라우저 열기 (선택사항)
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "GitHub Actions 페이지를 브라우저로 열까요? (y/n): " open_browser
    if [ "$open_browser" = "y" ]; then
        open "https://github.com/yoonjb83/hangaonco-kmex/actions"
        echo -e "${GREEN}✅ 브라우저에서 열었습니다.${NC}"
    fi
fi

echo ""
echo -e "${GRAY}Press Enter to exit...${NC}"
read
