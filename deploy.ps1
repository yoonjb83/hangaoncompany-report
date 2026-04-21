# ============================================
# 한가온컴퍼니 진단 플랫폼 배포 스크립트
# Windows PowerShell 전용
# ============================================

Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   한가온컴퍼니 병의원 경영 정밀진단 배포 시작   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. 저장소 확인
Write-Host "📁 Step 1: 저장소 확인 중..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "❌ 오류: Git 저장소가 아닙니다." -ForegroundColor Red
    Write-Host "   이 스크립트는 프로젝트 루트 폴더에서 실행해야 합니다." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✅ Git 저장소 확인 완료" -ForegroundColor Green
Write-Host ""

# 2. 변경사항 확인
Write-Host "📝 Step 2: 변경된 파일 확인 중..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "변경된 파일:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
} else {
    Write-Host "⚠️  경고: 변경된 파일이 없습니다." -ForegroundColor Yellow
    $continue = Read-Host "그래도 계속하시겠습니까? (y/n)"
    if ($continue -ne "y") {
        Write-Host "배포를 취소합니다." -ForegroundColor Yellow
        pause
        exit 0
    }
}
Write-Host ""

# 3. 스테이징
Write-Host "➕ Step 3: 파일 스테이징 중..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 파일 스테이징 완료" -ForegroundColor Green
} else {
    Write-Host "❌ 스테이징 실패" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

# 4. 커밋
Write-Host "💾 Step 4: 커밋 생성 중..." -ForegroundColor Yellow
$commitMessage = @"
Feat: 진단 리포트 기능 강화 및 UX 개선

- 보고서 저장 기능 개선 (고품질 PNG, 타임스탬프 파일명)
- 개원/기개원 리포트 내용 강화 (섹션 12개 추가)
- 입력 필드 자동 포커스 전환 기능 추가
- 신규 CSS 스타일 13개 추가
- 응답 데이터와 문항 매칭 명확화
"@

git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 커밋 생성 완료" -ForegroundColor Green
} else {
    Write-Host "⚠️  경고: 커밋할 변경사항이 없거나 커밋 실패" -ForegroundColor Yellow
}
Write-Host ""

# 5. 푸시
Write-Host "🚀 Step 5: GitHub에 푸시 중..." -ForegroundColor Yellow
Write-Host "   (인증이 필요할 수 있습니다)" -ForegroundColor Gray
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 푸시 완료!" -ForegroundColor Green
} else {
    Write-Host "❌ 푸시 실패" -ForegroundColor Red
    Write-Host "   다음을 확인하세요:" -ForegroundColor Yellow
    Write-Host "   - GitHub 인증 정보" -ForegroundColor Yellow
    Write-Host "   - 인터넷 연결" -ForegroundColor Yellow
    Write-Host "   - 저장소 권한" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host ""

# 6. 배포 완료
Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ 배포 완료!                        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. GitHub Actions에서 배포 상태 확인 (1~2분 소요)" -ForegroundColor White
Write-Host "   👉 https://github.com/yoonjb83/hangaonco-kmex/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "2. 배포 완료 후 사이트 접속:" -ForegroundColor White
Write-Host "   👉 https://yoonjb83.github.io/hangaonco-kmex/" -ForegroundColor Blue
Write-Host ""
Write-Host "3. 새 기능 테스트 (5분)" -ForegroundColor White
Write-Host "   - 리포트 이미지 저장" -ForegroundColor Gray
Write-Host "   - 입력 필드 자동 포커스" -ForegroundColor Gray
Write-Host "   - 강화된 리포트 내용" -ForegroundColor Gray
Write-Host ""
Write-Host "4. (선택) 도메인 변경 (5~10분)" -ForegroundColor White
Write-Host "   👉 GitHub_도메인_변경_가이드.md 참조" -ForegroundColor Blue
Write-Host ""

# 브라우저에서 GitHub Actions 열기 (선택사항)
$openBrowser = Read-Host "GitHub Actions 페이지를 브라우저로 열까요? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process "https://github.com/yoonjb83/hangaonco-kmex/actions"
    Write-Host "✅ 브라우저에서 열었습니다." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
pause
