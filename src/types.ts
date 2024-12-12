import { ReactNode } from "react"
import { AnimationEnum } from "./utils"

// 컴포넌트 Props 타입 정의
export interface PopEffectProps {
  children: ReactNode
  onStack?: boolean // 바닥에 쌓이는 효과 활성화 여부
  groundY?: number // 바닥 위치 (px)
  maxStackedItems?: number // 최대 쌓이는 아이템 수
  spawnInterval?: number // 생성 간격 (ms)
  animationType?: AnimationEnum // 애니메이션 타입
}

// 복제된 요소의 상태 타입 정의
export interface CloneItem {
  createdAt: number
  style: React.CSSProperties
  finalPosition?: { x: number; y: number } // 최종 위치
}

// 이벤트 타입 별칭 정의
export type MouseOrTouchEvent = React.MouseEvent | React.TouchEvent
export type GlobalMouseOrTouchEvent = globalThis.MouseEvent | globalThis.TouchEvent

// 위치 정보 타입 정의
export interface Position {
  x: number
  y: number
}
