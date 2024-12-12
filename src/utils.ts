import { CloneItem, MouseOrTouchEvent, GlobalMouseOrTouchEvent, Position } from "./types"

// 애니메이션 타입을 관리하는 enum 추가
export enum AnimationEnum {
  EXPLOSIVE = "explosive",
  SPREAD = "spread",
}

// 애니메이션 타입에 따라 적절한 스타일 계산 함수를 반환하는 팩토리 함수
export const getAnimationStyleCalculator = (type: AnimationEnum) => {
  switch (type) {
    case AnimationEnum.EXPLOSIVE:
      return calculateExplosiveCloneStyle
    case AnimationEnum.SPREAD:
      return calculateSpreadCloneStyle
    default:
      return calculateExplosiveCloneStyle
  }
}

// 복제된 요소의 스타일 계산 함수
export const calculateExplosiveCloneStyle = (
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

// 퍼지는 애니메이션
export const calculateSpreadCloneStyle = (
  clientX: number,
  clientY: number,
  stackOnGround: boolean,
  groundY: number,
  elementWidth: number,
  elementHeight: number
): Pick<CloneItem, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.4, 0.8)
  const duration = getRandomValue(0.8, 1.2)
  const angle = getRandomValue(0, Math.PI * 2)
  const distance = getRandomValue(100, 300)

  const finalX = clientX + Math.cos(angle) * distance
  const finalY = clientY + Math.sin(angle) * distance

  return {
    style: {
      transform: `translate(${clientX - elementWidth / 2}px, ${clientY - elementHeight / 2}px)`,
      animation: `spread ${duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
      "--start-x": `${clientX - elementWidth / 2}px`,
      "--start-y": `${clientY - elementHeight / 2}px`,
      "--final-x": `${finalX}px`,
      "--final-y": `${finalY}px`,
      "--scale": scale,
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

// 랜덤 값 생성 유틸리티 함수
export const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}
