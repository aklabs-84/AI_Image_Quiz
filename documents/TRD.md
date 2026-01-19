# [TRD] AI vs Human Art Quiz (Technical Requirements Document)

## 1. 시스템 아키텍처 (System Architecture)

**이 애플리케이션은** **Serverless Client-side SPA (Single Page Application)** **구조로 설계되었습니다. 백엔드 서버 없이 브라우저에서 직접 Google Gemini API와 통신하며, 상태 관리는 React의** **useState**와 **useCallback**을 활용합니다.

## 2. 기술 스택 (Tech Stack)

- **Core:** **React 19 (Functional Components)**
- **Language:** **TypeScript (Strict Type Checking)**
- **Styling:** **Tailwind CSS (Utility-first framework)**
- **AI SDK:** **@google/genai** **(Google Generative AI SDK)**
- **Audio Engine:** **Tone.js (Web Audio API Wrapper)**
- **Build/Runtime:** **ESM (ES Modules) via CDN import maps**

## 3. 핵심 모듈 및 데이터 흐름 (Core Modules)

### 3.1. 게임 상태 관리 (App.tsx)

**GameStatus** **열거형(Enum)을 사용하여 유한 상태 기계(Finite State Machine)로 관리합니다.**

- **Start**: 초기 진입 및 설정 화면.
- **Playing**: 퀴즈 진행 화면.
- **Finished**: 결과 및 리뷰 화면.

### 3.2. AI 이미지 생성 엔진 (generateImage 함수)

**Gemini API를 호출하는 비동기 함수로, 매개변수에 따라 프롬프트를 동적으로 조립합니다.**

- **프롬프트 인젝션 (Difficulty Logic):**
  - **Easy**: AI 이미지에는 "uncanny perfection", "synthetic look" 추가 / 사람 이미지에는 "rough amateur sketch" 추가.
  - **Hard**: AI 이미지에는 "masterfully deceptive", "natural camera imperfections" 추가하여 판별 난이도 상승.

- **멀티 모델 지원:**
  - **Eco**: **gemini-2.5-flash-image** **모델 사용.**
  - **Pro**: **gemini-3-pro-image-preview** **모델 사용 (1K 해상도 설정).**

### 3.3. 오디오 시스템 (sound.ts)

**Tone.js**를 활용하여 지연 없는 오디오 경험을 제공합니다.

- **PolySynth**: 정답 시의 맑은 화음 생성.
- **MonoSynth**: 오답 시의 낮은 베이스 음 생성.
- **MembraneSynth**: 결과 화면의 웅장한 킥 사운드 구현.

## 4. UI/UX 컴포넌트 명세 (Component Specification)

| **컴포넌트**      | **주요 기술적 특징**                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| **StartScreen**   | **모델/난이도 설정 보존,** **GuideModal** **(Absolute Positioning) 포함.**             |
| **LoadingScreen** | **생성 진행률(**progress**) 수신 및** **animate-spin/pulse** **기반의 시각적 피드백.** |
| **QuestionCard**  | **이미지 로딩 상태 처리,** **FeedbackAnimation** **(CSS Keyframes) 내장.**             |
| **ImageModal**    | **fixed** **포탈 스타일의 고해상도 이미지 확대 뷰어.**                                 |
| **ResultScreen**  | **useCountUp** **커스텀 훅을 통한 점수 카운팅 애니메이션.**                            |

## 5. 데이터 구조 (Data Structure)

### 5.1. Question 인터페이스

**code**TypeScript

```
interface Question {
  id: number;
  style: string;
  images: [ImageOptionData, ImageOptionData]; // AI와 Human 이미지 쌍
  correctAnswer: 'A' | 'B';
  explanation: string; // 판별 단서 텍스트
}
```

### 5.2. 점수 산출 로직

- **기본 점수: 1점**
- **보너스 점수:**

  ```

  ```

  **(단, 콤보가 1 이상일 때)**

- **누적 방식:** **score = score + (1 + bonus)**

## 6. 예외 처리 및 성능 최적화 (Error Handling & Optimization)

- **API 보안 및 한도:** **API 호출 실패(429, 403 등) 감지 시** **window.aistudio.openSelectKey()**를 호출하여 사용자가 직접 API 키를 갱신할 수 있도록 유도.
- **병렬 처리:** **각 라운드의 이미지(A, B)를** **Promise.all**로 병렬 생성하여 대기 시간 50% 단축.
- **메모리 관리:** **오디오 컨텍스트를 사용자 상호작용(**initAudio**) 후 활성화하여 브라우저 정책 준수.**
- **이미지 최적화:** **object-cover**와 **aspect-square**를 사용하여 다양한 해상도의 AI 생성 이미지를 일관된 레이아웃으로 출력.

## 7. 인프라 및 보안 (Infrastructure)

- **API Key:** **process.env.API_KEY**를 통해 주입되며, 클라이언트 사이드에서 동적으로 인스턴스화(**new GoogleGenAI**)하여 보안 정책 준수.
- **권한:** **metadata.json**을 통해 카메라/마이크 권한이 필요 없음을 명시하여 불필요한 브라우저 팝업 방지.
