export type RepositoryId =
  | "next-step/java-racingcar-simple-playground"
  | "next-step/java-lotto-clean-playground"
  | "next-step/java-ladder-func-playground";

export interface Repository {
  id: RepositoryId;
  name: string;
  emoji: string;
  description: string;
  githubUrl: string;
}

export const REPOSITORIES: Repository[] = [
  {
    id: "next-step/java-racingcar-simple-playground",
    name: "자동차 경주",
    emoji: "🏎️",
    description: "원시값과 일급 컬렉션을 활용한 자동차 경주 게임",
    githubUrl: "https://github.com/next-step/java-racingcar",
  },
  {
    id: "next-step/java-lotto-clean-playground",
    name: "로또",
    emoji: "🎰",
    description: "TDD와 OOP를 적용한 로또 번호 생성기",
    githubUrl: "https://github.com/next-step/java-lotto",
  },
  {
    id: "next-step/java-ladder-func-playground",
    name: "사다리 타기",
    emoji: "🪜",
    description: "함수형 프로그래밍을 활용한 사다리 게임",
    githubUrl: "https://github.com/next-step/java-ladder-func-playground",
  },
];

export const KEYWORD_CATEGORIES = {
  oop: {
    name: "객체지향 및 설계 원칙",
    emoji: "🎯",
    keywords: [
      "객체지향",
      "캡슐화",
      "상속",
      "다형성",
      "추상화",
      "인터페이스",
      "구현체",
      "의존성",
      "의존 역전 원칙",
      "개방 폐쇄 원칙",
      "단일 책임 원칙",
      "단일 책임",
      "srp",
      "책임",
      "SOLID",
      "응집도",
      "결합도",
      "불변",
      "상태 관리",
    ],
  },
  architecture: {
    name: "아키텍처 및 디자인 패턴",
    emoji: "🏗️",
    keywords: [
      "MVC",
      "레이어드 아키텍처",
      "패키지 구조",
      "와일드카드",
      "팩토리 패턴",
      "전략 패턴",
      "싱글톤 패턴",
      "빌더 패턴",
      "정적 팩토리 메서드",
      "정팩메",
      "래퍼클래스",
      "Wrapper Class",
      "Wrapper",
    ],
  },
  codeQuality: {
    name: "코드 품질 및 Java 기본",
    emoji: "✨",
    keywords: [
      "리팩터링",
      "리팩토링",
      "중복",
      "가독성",
      "네이밍",
      "일급 컬렉션",
      "원시값 포장",
      "상수화",
      "매직 넘버",
      "상수",
      "유틸",
      "enum",
      "static",
      "final",
      "함수형 인터페이스",
      "람다",
      "lambda",
      "Stream",
      "스트림",
      "Optional",
      "Null",
      "컬렉션",
      "collection",
      "List",
      "Map",
      "Set",
      "ArrayList",
      "HashMap",
      "HashSet",
      "equals",
      "hashCode",
      "Comparable",
      "Comparator",
      "StringBuilder",
      "제네릭",
      "generic",
      "예외 처리",
      "예외",
      "Checked Exception",
      "Unchecked Exception",
    ],
  },
  testing: {
    name: "테스트",
    emoji: "🧪",
    keywords: [
      "단위 테스트",
      "통합 테스트",
      "JUnit",
      "AssertJ",
      "커버리지",
      "given-when-then",
      "Mock",
      "BeforeEach",
      "AfterEach",
      "ParameterizedTest",
      "인수 테스트",
      "fixture",
      "픽스쳐",
      "test",
    ],
  },
};
