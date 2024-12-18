import { getRandomValue } from "./utils"
import type { CloneItemType } from "./hooks/useCloneCreator"

// 애니메이션 타입
export type AnimationType = "explosive" | "spread"

// 공통 설정을 위한 인터페이스 정의
type AnimationConfig = {
  cursorX: number
  cursorY: number
  isStackable: boolean
  elementWidth: number
  elementHeight: number
  groundY?: number // explosive에서 사용
  range?: number // spread에서 사용
}

// 애니메이션 타입에 따라 적절한 스타일 계산 함수를 반환하는 팩토리 함수
export const getAnimationStyleCalculator = (type: AnimationType) => {
  return (config: AnimationConfig): Pick<CloneItemType, "style" | "finalPosition"> => {
    switch (type) {
      case "explosive":
        return calculateExplosiveCloneStyle(config)
      case "spread":
        return calculateSpreadCloneStyle(config)
      default:
        return calculateExplosiveCloneStyle(config)
    }
  }
}

// 폭발 애니메이션 (기본)
export const calculateExplosiveCloneStyle = ({
  cursorX,
  cursorY,
  isStackable,
  elementWidth,
  elementHeight,
  groundY = 0, // 기본값 설정
  range = 300,
}: AnimationConfig): Pick<CloneItemType, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.3, 1)
  const duration = getRandomValue(1, 1.5)
  const rotation = getRandomValue(-720, 720)
  const horizontalDistance = getRandomValue(-range, range)
  const finalX = cursorX + horizontalDistance
  const finalY = isStackable ? groundY - 20 : cursorY + 500

  return {
    style: {
      animation: isStackable
        ? `explosive-stack ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`
        : `explosive-fall ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
      "--start-x": `${cursorX - elementWidth / 2}px`,
      "--start-y": `${cursorY - elementHeight / 2}px`,
      "--final-x": `${finalX}px`,
      "--final-y": `${finalY}px`,
      "--peak-y": `${cursorY - getRandomValue(200, 400)}px`,
      "--scale": scale,
      "--rotation": `${rotation}deg`,
      "--final-opacity": isStackable ? "1" : "0",
    } as React.CSSProperties,
    finalPosition: { x: finalX, y: finalY },
  }
}

// 퍼지는 애니메이션
export const calculateSpreadCloneStyle = ({
  cursorX,
  cursorY,
  isStackable,
  elementWidth,
  elementHeight,
  range = 300, // 기본값 설정
}: AnimationConfig): Pick<CloneItemType, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.4, 0.8)
  const duration = getRandomValue(0.8, 1.2)
  const angle = getRandomValue(0, Math.PI * 2)
  const distance = getRandomValue(100, range)

  const finalX = cursorX + Math.cos(angle) * distance
  const finalY = cursorY + Math.sin(angle) * distance

  return {
    style: {
      animation: `spread ${duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
      "--start-x": `${cursorX - elementWidth / 2}px`,
      "--start-y": `${cursorY - elementHeight / 2}px`,
      "--final-x": `${finalX}px`,
      "--final-y": `${finalY}px`,
      "--scale": scale,
      "--final-opacity": isStackable ? "1" : "0",
    } as React.CSSProperties,
    finalPosition: { x: finalX, y: finalY },
  }
}
