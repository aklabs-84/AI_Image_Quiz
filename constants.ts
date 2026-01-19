
export interface QuizTemplate {
  id: number;
  style: string;
  aiPrompt: string;
  humanPrompt: string;
  correctAnswer: 'A' | 'B';
  explanation: string;
}

export const QUIZ_TEMPLATES: QuizTemplate[] = [
  {
    id: 1,
    style: "초상화 (Portrait)",
    aiPrompt: "A hyper-realistic close-up portrait of a person with slightly too perfect skin and complex lighting, 8k resolution, cinematic lighting.",
    humanPrompt: "A professional candid street photography portrait of a person, natural skin textures, slight imperfections, soft natural daylight, film grain.",
    correctAnswer: 'A',
    explanation: "AI는 종종 피부를 너무 매끄럽게 표현하거나, 머리카락과 배경의 경계를 미묘하게 뭉뚱그리는 경향이 있습니다."
  },
  {
    id: 2,
    style: "애니메이션 (Anime)",
    aiPrompt: "High-quality anime character concept art, vibrant colors, extremely detailed hair and eyes, digital perfection.",
    humanPrompt: "Hand-drawn traditional anime style illustration, subtle ink lines, watercolor texture, slight asymmetry in features.",
    correctAnswer: 'A',
    explanation: "AI 애니메이션은 채도가 매우 높고 선이 완벽하지만, 전통적인 수작업의 거친 질감은 부족할 수 있습니다."
  },
  {
    id: 3,
    style: "유화 (Oil Painting)",
    aiPrompt: "An abstract oil painting with thick impasto strokes, AI-interpreted color palette, complex fractal-like patterns.",
    humanPrompt: "A classic 19th-century impressionist oil painting of a garden, visible brushstrokes, natural color blending, emotional atmosphere.",
    correctAnswer: 'A',
    explanation: "AI는 유명 화가의 화풍을 잘 흉내 내지만, 캔버스의 실제 질감이나 의도된 붓 터치의 강약 조절이 다를 수 있습니다."
  },
  {
    id: 4,
    style: "판타지 풍경 (Fantasy Landscape)",
    aiPrompt: "A breathtaking fantasy floating island with glowing waterfalls, impossible physics, hyper-detailed vegetation.",
    humanPrompt: "A grand epic landscape painting of a mountain range at sunset, realistic atmospheric perspective, subtle mist, classical composition.",
    correctAnswer: 'A',
    explanation: "AI는 물리 법칙을 무시하는 웅장한 풍경을 곧잘 만들지만, 그림자의 방향이나 물의 반사가 비현실적일 때가 있습니다."
  },
  {
    id: 5,
    style: "음식 사진 (Food Photography)",
    aiPrompt: "A gourmet burger with melting cheese, hyper-glossy textures, advertisement-style perfection, studio lighting.",
    humanPrompt: "A rustic home-cooked meal on a wooden table, steam rising, natural window light, messy edges, realistic shadows.",
    correctAnswer: 'A',
    explanation: "AI 음식 이미지는 너무 윤기가 나거나 실제 음식으로는 불가능한 완벽한 층을 보여주기도 합니다."
  }
];
