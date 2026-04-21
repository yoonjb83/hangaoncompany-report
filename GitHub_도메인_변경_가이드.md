# GitHub Pages 도메인 변경 가이드
## hangaonco-kmex → hangaon-report 변경 절차

---

## 📋 변경 전 현황

| 항목 | 현재 | 변경 후 |
|------|------|---------|
| **저장소 이름** | `hangaonco-kmex` | `hangaon-report` |
| **도메인** | `yoonjb83.github.io/hangaonco-kmex/` | `yoonjb83.github.io/hangaon-report/` |
| **소요 시간** | - | 약 5~10분 |
| **배포 시간** | - | 약 1~2분 |

---

## 🚀 단계별 변경 절차

### ✅ STEP 1: GitHub 저장소 이름 변경

#### 1-1) GitHub.com 접속
1. [GitHub.com](https://github.com) 접속
2. 로그인 (yoonjb83 계정)

#### 1-2) hangaonco-kmex 저장소 접속
1. 왼쪽 사이드바의 "Your repositories" 클릭
2. 목록에서 `hangaonco-kmex` 클릭
3. 또는 직접 URL 입력: `https://github.com/yoonjb83/hangaonco-kmex`

#### 1-3) Repository Settings 열기
![Step 1-3 이미지 참조]
1. 저장소 페이지 상단의 **Settings** 탭 클릭
2. 왼쪽 사이드바에서 **General** 선택 (자동으로 열려있을 수 있음)

#### 1-4) Repository Name 변경
![Step 1-4 이미지 참조]
1. **Repository name** 입력 필드 찾기
   - 현재 값: `hangaonco-kmex`
2. 필드를 클릭하여 선택
3. 텍스트 모두 삭제 (`Ctrl+A` → `Delete`)
4. 새 이름 입력: `hangaon-report`

```
입력 전: hangaonco-kmex
입력 후: hangaon-report
```

#### 1-5) 변경 저장
1. 입력 필드 아래의 **Rename** 버튼 클릭 (또는 자동 저장)
2. 확인 대화상자가 나타나면 **I understand, update the repository name** 확인란 체크
3. **Rename** 버튼 다시 클릭

#### 1-6) 성공 확인
- GitHub가 리다이렉트 페이지로 이동
- 새 URL로 자동 이동: `https://github.com/yoonjb83/hangaon-report`
- ✅ 완료!

---

### ✅ STEP 2: GitHub Pages 설정 확인

#### 2-1) GitHub Pages 섹션 찾기
1. 동일한 Settings 페이지에서 **Code and automation** 섹션 찾기
2. 왼쪽 사이드바에서 **Pages** 클릭

#### 2-2) 배포 설정 확인
![Step 2-2 이미지 참조]

다음 항목 확인:

| 항목 | 설정값 |
|------|--------|
| **Source** | Deploy from a branch |
| **Branch** | main (또는 gh-pages) |
| **Folder** | / (root) |

#### 2-3) 설정 저장
- 위 항목들이 올바르면 변경 불필요
- 변경했다면 **Save** 버튼 클릭

#### 2-4) 배포 상태 확인
1. GitHub Pages 섹션 상단에서 배포 상태 확인
2. 초록 체크마크와 함께 다음과 같은 메시지:
   ```
   ✅ Your site is published at https://yoonjb83.github.io/hangaon-report/
   ```

---

### ✅ STEP 3: 로컬 저장소 업데이트 (선택)

#### 3-1) 로컬 환경에서 저장소를 클론했다면

**Windows (Command Prompt 또는 PowerShell):**
```bash
# 저장소 폴더로 이동
cd C:\Users\[사용자명]\Documents\hangaonco-kmex

# 원격 저장소 URL 변경
git remote set-url origin https://github.com/yoonjb83/hangaon-report.git

# 변경 확인
git remote -v
# 출력: origin https://github.com/yoonjb83/hangaon-report.git (fetch)
#      origin https://github.com/yoonjb83/hangaon-report.git (push)
```

**Mac/Linux:**
```bash
cd ~/Documents/hangaonco-kmex
git remote set-url origin https://github.com/yoonjb83/hangaon-report.git
git remote -v
```

#### 3-2) 폴더명도 변경하려면 (선택사항)
```bash
# 터미널/명령 프롬프트에서
cd .. # 한 단계 위로 이동
mv hangaonco-kmex hangaon-report  # Mac/Linux
# 또는
ren hangaonco-kmex hangaon-report  # Windows (PowerShell)

cd hangaon-report
git status  # 확인
```

---

### ✅ STEP 4: 배포 확인 및 대기

#### 4-1) GitHub Actions 확인
1. GitHub 저장소 페이지로 돌아가기
2. 상단의 **Actions** 탭 클릭
3. 최근 배포 작업 확인
4. 초록 체크마크 확인 (성공) 또는 빨간 X (실패)

#### 4-2) 배포 완료 대기
- 저장소 이름 변경 후 자동 배포 시작
- 배포 시간: 약 **1~2분**
- GitHub Actions에서 실시간 진행상황 확인 가능

#### 4-3) 새 도메인에서 접속
```
https://yoonjb83.github.io/hangaon-report/
```

1. 브라우저 주소창에 위 URL 입력
2. 페이지 로드 확인
3. 모든 기능 정상 작동 확인

#### 4-4) 캐시 초기화 (필요 시)
- 기존 도메인에서 캐시가 남아있으면 초기화:
  - Windows: `Ctrl + Shift + Delete`
  - Mac: `Cmd + Shift + Delete`
- 시크릿 창/개인정보보호 모드에서 테스트

---

## 📌 변경 전후 비교

### 변경 전
```
저장소 이름: hangaonco-kmex
직접 URL: https://github.com/yoonjb83/hangaonco-kmex
배포 URL: https://yoonjb83.github.io/hangaonco-kmex/
```

### 변경 후
```
저장소 이름: hangaon-report
직접 URL: https://github.com/yoonjb83/hangaon-report
배포 URL: https://yoonjb83.github.io/hangaon-report/
```

---

## ⚠️ 주의사항

### 1. 기존 링크 리다이렉트
- GitHub는 자동으로 기존 저장소 URL을 새 URL로 리다이렉트함
- 리다이렉트 기간: 24시간 (영구적일 수 있음)
- **대비:** 마케팅 자료에 새 도메인 사용

### 2. 로컬 저장소 연결
- 로컬에서 `git push/pull`을 사용하면 원격 URL이 일치해야 함
- 위의 "STEP 3"에서 설명한 대로 `git remote set-url` 사용

### 3. CI/CD 파이프라인
- GitHub Actions 자동 배포 재설정 불필요 (자동 처리)
- 단, `.github/workflows/` 파일에 고정 URL이 있으면 수동 수정 필요

### 4. DNS 및 커스텀 도메인
- GitHub Pages 커스텀 도메인을 사용하지 않으므로 추가 설정 불필요
- CNAME 파일 없음

---

## 🔄 리다이렉트 설정 (선택사항)

기존 링크를 계속 지원하려면:

### 방법 1: 기존 저장소에 리다이렉트 페이지 남기기
1. **hangaonco-kmex** 저장소 유지
2. `index.html`에 다음 추가:
```html
<meta http-equiv="refresh" content="0;url=https://yoonjb83.github.io/hangaon-report/">
```

### 방법 2: GitHub에서 자동 리다이렉트 사용
- GitHub는 저장소 이름 변경 후 24시간 자동 리다이렉트 제공
- 추가 설정 불필요

### 추천
✅ **방법 2 (GitHub 자동 리다이렉트) 권장**

---

## ✅ 검증 체크리스트

변경 후 다음을 확인하세요:

### 기술적 검증
- [ ] GitHub 저장소 이름이 `hangaon-report`로 변경됨
- [ ] 저장소 URL: `https://github.com/yoonjb83/hangaon-report` 접속 가능
- [ ] GitHub Actions에서 배포 성공 (초록 체크)
- [ ] 배포된 도메인: `https://yoonjb83.github.io/hangaon-report/` 접속 가능
- [ ] 로컬 저장소 `git remote -v` 확인 (새 URL 표시)

### 기능 검증
- [ ] 진단 시작하기 버튼 작동
- [ ] 정보 입력 양식 작동
- [ ] 진단 문항 표시
- [ ] 최종 리포트 생성
- [ ] 리포트 이미지 저장 버튼 작동

### UX 검증
- [ ] 성함 입력 → Enter → 연락처 포커스
- [ ] 연락처 입력 → Enter → 이메일 포커스
- [ ] 이메일 입력 → Enter → 동의서 스크롤
- [ ] 폰 번호 자동 포매팅 (010-0000-0000)

### 데이터 검증
- [ ] Google Sheets에 데이터 전송 확인
- [ ] 응답 데이터 정상 저장

---

## 🆘 트러블슈팅

### 문제 1: 저장소 이름 변경 후에도 기존 URL이 작동함
**원인:** GitHub 리다이렉트 (24시간)
**해결:** 새 URL 사용, 또는 24시간 대기

---

### 문제 2: GitHub Pages에서 "404" 에러
**원인:** Settings → Pages에서 Source 설정 안 됨
**해결:**
1. Settings → Pages 확인
2. Source를 "Deploy from a branch"로 설정
3. Branch를 "main"으로 설정
4. 폴더를 "/ (root)"로 설정
5. Save 클릭 후 1~2분 대기

---

### 문제 3: 로컬에서 `git push` 실패
**에러:** `fatal: 'origin' does not appear to be a git repository`

**해결:**
```bash
# 현재 원격 URL 확인
git remote -v

# 새 URL로 변경
git remote set-url origin https://github.com/yoonjb83/hangaon-report.git

# 다시 확인
git remote -v
```

---

### 문제 4: 새 도메인에서 CSS/이미지 안 보임
**원인:** 기존 도메인 캐시
**해결:**
1. 브라우저 캐시 완전 초기화 (`Ctrl + Shift + Delete`)
2. 시크릿 창에서 테스트
3. 다른 브라우저에서 테스트

---

### 문제 5: GitHub Actions 배포 실패
**확인 방법:**
1. 저장소의 **Actions** 탭 클릭
2. 최근 작업 확인
3. 빨간 X가 있으면 클릭하여 에러 메시지 확인

**일반적인 에러 및 해결:**
```
✗ Error: Pages site could not be built
→ index.html 파일이 있는지 확인 (root 폴더)
→ JavaScript/CSS 파일 경로 확인

✗ Error: Deployment failed  
→ 저장소 권한 확인
→ 몇 분 후 재시도
```

---

## 📞 추가 지원

**GitHub 공식 문서:**
- [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

**GitHub Pages 배포 상태 확인:**
1. 저장소 → Actions 탭
2. 또는 Settings → Pages에서 배포 URL 클릭

---

## 📋 최종 체크리스트

완료한 항목에 체크하세요:

### Phase 1: 저장소 변경
- [ ] GitHub.com에서 Settings → General 접속
- [ ] Repository name을 `hangaon-report`로 변경
- [ ] Rename 버튼 클릭 및 확인

### Phase 2: GitHub Pages 설정
- [ ] Settings → Pages 섹션 확인
- [ ] Source: "Deploy from a branch" 설정
- [ ] Branch: "main" 선택
- [ ] Folder: "/ (root)" 설정

### Phase 3: 배포 확인
- [ ] Actions 탭에서 배포 성공 확인 (초록 체크)
- [ ] 새 URL 접속 확인: `https://yoonjb83.github.io/hangaon-report/`
- [ ] 모든 기능 정상 작동 확인

### Phase 4: 로컬 환경 (선택)
- [ ] `git remote -v` 확인 후 필요 시 URL 변경
- [ ] 로컬 폴더명 변경 (선택사항)

### Phase 5: 마케팅 업데이트
- [ ] QR코드 재생성 (새 도메인 기반)
- [ ] 웹사이트/이메일 링크 업데이트
- [ ] SNS 프로필 업데이트

---

**완료 예정일:** 2024년 4월 20일~21일

