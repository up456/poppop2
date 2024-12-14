import { CloneItem } from "./types"
import { getRandomValue } from "./utils"

// 애니메이션 타입을 관리하는 enum 추가
export enum AnimationEnum {
  EXPLOSIVE = "explosive",
  SPREAD = "spread",
}

// 공통 설정을 위한 인터페이스 정의
interface AnimationConfig {
  clientX: number
  clientY: number
  onStack: boolean
  elementWidth: number
  elementHeight: number
  groundY?: number // explosive에서 사용
  range?: number // spread에서 사용
}

// 애니메이션 타입에 따라 적절한 스타일 계산 함수를 반환하는 팩토리 함수
export const getAnimationStyleCalculator = (type: AnimationEnum) => {
  return (config: AnimationConfig): Pick<CloneItem, "style" | "finalPosition"> => {
    switch (type) {
      case AnimationEnum.EXPLOSIVE:
        return calculateExplosiveCloneStyle(config)
      case AnimationEnum.SPREAD:
        return calculateSpreadCloneStyle(config)
      default:
        return calculateExplosiveCloneStyle(config)
    }
  }
}

// 폭발 애니메이션 (기본)
export const calculateExplosiveCloneStyle = ({
  clientX,
  clientY,
  onStack,
  elementWidth,
  elementHeight,
  groundY = 0, // 기본값 설정
  range = 300,
}: AnimationConfig): Pick<CloneItem, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.3, 1)
  const duration = getRandomValue(1, 1.5)
  const rotation = getRandomValue(-720, 720)
  const horizontalDistance = getRandomValue(-range, range)
  const finalX = clientX + horizontalDistance
  const finalY = onStack ? groundY - 20 : clientY + 500

  return {
    style: {
      transform: `translate(${clientX - elementWidth / 2}px, ${clientY - elementHeight / 2}px)`,
      animation: onStack
        ? `explosive-stack ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`
        : `explosive-fall ${duration}s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
      "--start-x": `${clientX - elementWidth / 2}px`,
      "--start-y": `${clientY - elementHeight / 2}px`,
      "--final-x": `${finalX}px`,
      "--final-y": `${finalY}px`,
      "--peak-y": `${clientY - getRandomValue(200, 400)}px`,
      "--scale": scale,
      "--rotation": `${rotation}deg`,
      "--final-opacity": onStack ? "1" : "0",
    } as React.CSSProperties,
    finalPosition: { x: finalX, y: finalY },
  }
}

// 퍼지는 애니메이션
export const calculateSpreadCloneStyle = ({
  clientX,
  clientY,
  onStack,
  elementWidth,
  elementHeight,
  range = 300, // 기본값 설정
}: AnimationConfig): Pick<CloneItem, "style" | "finalPosition"> => {
  const scale = getRandomValue(0.4, 0.8)
  const duration = getRandomValue(0.8, 1.2)
  const angle = getRandomValue(0, Math.PI * 2)
  const distance = getRandomValue(100, range)

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
      "--final-opacity": onStack ? "1" : "0",
    } as React.CSSProperties,
    finalPosition: { x: finalX, y: finalY },
  }
}
