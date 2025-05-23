"use client"

import React, { useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { getPositionFromEvent, injectStyles } from "../utils"
import { AnimationType } from "../animations"
import { useCloneCreator } from "../hooks/useCloneCreator"

// 컴포넌트 Props 타입 정의
interface Props {
  children: ReactNode
  isStackable?: boolean // 바닥에 쌓이는 효과 활성화 여부
  maxStackedItems?: number // 최대 쌓이는 아이템 수
  spawnInterval?: number // 생성 간격 (ms)
  animationType?: AnimationType // 애니메이션 타입
  groundY?: number // 바닥 위치 (px)
  range?: number // 확산 범위 (px)
}

const PopChildrenBase = ({
  children,
  isStackable = false,
  maxStackedItems = 50,
  spawnInterval = 150,
  animationType = "explosive",
  groundY = 0,
  range = 300,
}: Props): React.JSX.Element => {
  // 상태 및 ref 관리
  const containerRef = useRef<HTMLDivElement>(null) // 컨테이너 참조
  const duration = 1.5 // 요소 유지 시간
  const [elementWidth, setElementWidth] = useState(0) // 요소 너비
  const [elementHeight, setElementHeight] = useState(0) // 요소 높이
  const [groundYState, setGroundYState] = useState(groundY || 0)

  const { clones, mousePositionRef, startCreatingClones, stopCreatingClones } = useCloneCreator({
    animationType,
    elementWidth,
    elementHeight,
    spawnInterval,
    duration,
    range,
    isStackable,
    maxStackedItems,
    groundY: groundYState,
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

  useEffect(() => {
    if (typeof window !== "undefined" && !groundY) {
      setGroundYState(window.innerHeight - 100)
    }
  }, [groundY])

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
    const cleanup = injectStyles(styles)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("touchmove", handleGlobalMouseMove)
      cleanup
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

export const PopChildren = (props: Props): React.JSX.Element => {
  try {
    return <PopChildrenBase {...props} />
  } catch (error) {
    console.warn("PopChildren 렌더링 실패:", error)
    return <>{props.children}</>
  }
}

const styles = `
/* 컨테이너 스타일 */
.pop-container {
  display: inline-block;
}

/* 클릭 가능한 트리거 영역 스타일 */
.pop-trigger {
  cursor: pointer;
}

/* 복제된 요소의 기본 스타일 */
.pop-clone {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none; /* 마우스 이벤트 무시 */
  z-index: 1000; /* 다른 요소들 위에 표시 */
}

/* 요소가 폭발하고 사라지는 애니메이션 */
@keyframes explosive-fall {
  0% {
    transform: translate(var(--start-x), var(--start-y)) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(calc(var(--start-x) + (var(--final-x) - var(--start-x)) * 0.5), var(--peak-y))
      scale(var(--scale));
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--final-x), var(--final-y)) scale(var(--scale));
    opacity: var(--final-opacity);
  }
}

/* 요소가 폭발하고 바닥에 쌓이는 애니메이션 */
@keyframes explosive-stack {
  0% {
    transform: translate(var(--start-x), var(--start-y)) scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translate(calc(var(--start-x) + (var(--final-x) - var(--start-x)) * 0.5), var(--peak-y))
      scale(var(--scale)) rotate(calc(var(--rotation) * 0.5));
    opacity: 1;
  }
  85% {
    opacity: 0.85;
  }
  100% {
    transform: translate(var(--final-x), var(--final-y)) scale(var(--scale)) rotate(var(--rotation));
    opacity: 1;
  }
}

/* 확산 애니메이션 */
@keyframes spread {
  0% {
    transform: translate(var(--start-x), var(--start-y));
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
  85% {
    opacity: 0.9;
  }
  100% {
    transform: translate(var(--final-x), var(--final-y)) scale(var(--scale));
    opacity: var(--final-opacity);
  }
}

`
