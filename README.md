# AI vs Human Art 퀴즈

Gemini가 실시간으로 생성한 이미지와 실제 작품(또는 사진)을 비교하여 AI 이미지를 맞히는 퀴즈 웹앱입니다.

## 로컬 실행 방법

**필수:** Node.js

1. 의존성 설치:
   `npm install`
2. 개발 서버 실행:
   `npm run dev`
3. 브라우저에서 앱 접속 후, 우측 상단 `API Key` 버튼을 눌러 Gemini API 키를 입력합니다.

## 사용 방법

1. 우측 상단 `API Key` 버튼에서 Gemini API 키를 입력합니다. (로컬 저장)
2. 모델 선택에서 `Eco` 또는 `Pro`를 고릅니다.
3. 난이도를 선택한 뒤 `퀴즈 생성하기`를 클릭합니다.
4. 두 이미지 중 AI가 생성한 이미지를 선택합니다.
5. 라운드가 끝나면 판별 단서로 학습하고, 결과 화면에서 점수를 확인합니다.

## 참고

- `.env.local`에 `GEMINI_API_KEY`를 설정하면 기본값으로 사용할 수 있습니다.
- `Pro` 모델은 더 높은 화질/정밀도를 사용하므로 생성 시간이 늘어날 수 있습니다.

## GitHub Pages 배포

이 프로젝트는 GitHub Actions로 빌드 후 GitHub Pages에 자동 배포하도록 설정되어 있습니다.
배포된 페이지를 사용하는 사용자는 우측 상단 `API Key`에서 각자 Gemini API 키를 입력해야 합니다.

1. 이 저장소를 `main` 브랜치로 푸시합니다.
2. GitHub 저장소 설정에서 Pages 소스를 **GitHub Actions**로 선택합니다.
3. 배포 완료 후 다음 주소에서 접근합니다:
   `https://{username}.github.io/{repo}/`

### 배포 동작 방식

- `VITE_BASE`를 `/{repo}/`로 설정하여 Pages 하위 경로에서도 자산이 올바르게 로드됩니다.
- 빌드 결과물은 `dist` 폴더이며, Actions가 이를 Pages로 배포합니다.
