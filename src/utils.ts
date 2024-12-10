import { CloneItem, MouseOrTouchEvent, GlobalMouseOrTouchEvent, Position } from "./types"

// 랜덤 값 생성 유틸리티 함수
export const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// 복제된 요소의 스타일 계산 함수
export const calculateCloneStyle = (
  clientX: number,
  clientY: number,
  stackOnGround: boolean,
  groundY: number,
  elementWidth: number,
  elementHeight: number
): Pick<CloneItem, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.3, 1)
  const duration = getRandomValue(1, 1.5)
  const rotation = getRandomValue(-720, 720)
  const horizontalDistance = getRandomValue(-300, 300)
  const finalX = clientX + horizontalDistance
  const finalY = stackOnGround ? groundY - 20 : clientY + 500

  return {
    style: {
      transform: `translate(${clientX - elementWidth / 2}px, ${clientY - elementHeight / 2}px)`,
      animation: stackOnGround
        ? `explosive-stack ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`
        : `explosive-fall ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
      "--start-x": `${clientX - elementWidth / 2}px`,
      "--start-y": `${clientY - elementHeight / 2}px`,
      "--final-x": `${finalX}px`,
      "--final-y": `${finalY}px`,
      "--peak-y": `${clientY - getRandomValue(200, 400)}px`,
      "--scale": scale,
      "--rotation": `${rotation}deg`,
      "--final-opacity": stackOnGround ? "1" : "0",
    } as React.CSSProperties,
    finalPosition: { x: finalX, y: finalY },
  }
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
export const getStackedClones = (clones: CloneItem[], maxItems: number): CloneItem[] => {
  return clones.slice(-maxItems)
}

// 사라지지 않고 보여지는 요소들을 반환하는 함수
export const getPersistentClones = (clones: CloneItem[], duration: number): CloneItem[] => {
  return clones.filter((clone) => Date.now() - clone.createdAt < duration * 1000)
}
