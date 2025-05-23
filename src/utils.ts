import type { CloneItemType } from "./hooks/useCloneCreator"

// 이벤트 타입 별칭 정의
export type MouseOrTouchEvent = React.MouseEvent | React.TouchEvent
export type GlobalMouseOrTouchEvent = globalThis.MouseEvent | globalThis.TouchEvent

// 위치 정보 타입 정의
export type Position = {
  x: number
  y: number
}

// 이벤트에서 위치 정보 추출 함수
export const getPositionFromEvent = (e: MouseOrTouchEvent | GlobalMouseOrTouchEvent): Position => {
  if ("touches" in e) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }
  return {
    x: (e as React.MouseEvent).clientX,
    y: (e as React.MouseEvent).clientY,
  }
}

// 쌓인 요소들을 반환하는 함수
export const getStackedClones = (clones: CloneItemType[], maxItems: number): CloneItemType[] => {
  return clones.slice(-maxItems)
}

// 사라지지 않고 보여지는 요소들을 반환하는 함수
export const getPersistentClones = (clones: CloneItemType[], duration: number): CloneItemType[] => {
  return clones.filter((clone) => Date.now() - clone.createdAt < duration * 1000)
}

// 랜덤 값 생성 유틸리티 함수
export const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// 스타일 주입 유틸리티 함수
export const injectStyles = (styles: string): (() => void) => {
  if (typeof document !== "undefined") {
    const styleElement = document.createElement("style")
    styleElement.textContent = styles
    document.head.appendChild(styleElement)

    // cleanup 함수 반환
    return () => {
      document.head.removeChild(styleElement)
    }
  }
  return () => {}
}
