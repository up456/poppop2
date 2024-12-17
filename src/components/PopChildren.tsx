import React, { useState, useCallback, useRef, useEffect, ReactNode } from "react"
import { getPositionFromEvent } from "../utils"
import "../styles/PopChildren.css"
import { AnimationEnum } from "../animations"
import { useCloneCreator } from "../hooks/useCloneCreator"

// 컴포넌트 Props 타입 정의
type Props = {
  children: ReactNode
  isStackable?: boolean // 바닥에 쌓이는 효과 활성화 여부
  maxStackedItems?: number // 최대 쌓이는 아이템 수
  spawnInterval?: number // 생성 간격 (ms)
  animationType?: AnimationEnum // 애니메이션 타입
  groundY?: number // 바닥 위치 (px)
  range?: number // 확산 범위 (px)
}

// 메인 컴포넌트
export const PopChildren: React.FC<Props> = ({
  children,
  isStackable = false,
  maxStackedItems = 50,
  spawnInterval = 150,
  animationType = AnimationEnum.EXPLOSIVE,
  groundY = typeof window !== "undefined" ? window.innerHeight - 100 : 0,
  range = 300,
}) => {
  // 상태 및 ref 관리
  const containerRef = useRef<HTMLDivElement>(null) // 컨테이너 참조
  const duration = 1.5 // 요소 유지 시간
  const [elementWidth, setElementWidth] = useState(0) // 요소 너비
  const [elementHeight, setElementHeight] = useState(0) // 요소 높이

  const { clones, mousePositionRef, startCreatingClones, stopCreatingClones } = useCloneCreator({
    animationType,
    elementWidth,
    elementHeight,
    spawnInterval,
    duration,
    range,
    isStackable,
    maxStackedItems,
    groundY,
  })

  // 마우스 이벤트 핸들러들
  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      mousePositionRef.current = getPositionFromEvent(e)
      startCreatingClones()
    },
    [startCreatingClones]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      stopCreatingClones()
    },
    [stopCreatingClones]
  )

  // DOM이 마운트된 후 크기를 업데이트
  useEffect(() => {
    if (containerRef.current) {
      setElementWidth(containerRef.current.clientWidth)
      setElementHeight(containerRef.current.clientHeight)
    }
  }, [containerRef.current])

  // 전역 마우스 이벤트 리스너 설정
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (mousePositionRef.current) {
        mousePositionRef.current = getPositionFromEvent(e)
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("touchmove", handleGlobalMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("touchmove", handleGlobalMouseMove)
    }
  }, [])

  // 렌더링
  return (
    <div ref={containerRef} className="pop-container">
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        className="pop-trigger"
      >
        {children}
      </div>
      {clones.map((clone) => (
        <div key={clone.createdAt} className="pop-clone" style={clone.style}>
          {children}
        </div>
      ))}
    </div>
  )
}
