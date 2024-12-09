import React, { useState, useCallback, useRef, useEffect } from "react"
import { PopEffectProps, CloneItem } from "../types"
import { calculateCloneStyle, getPositionFromEvent, getStackedClones, getPersistentClones } from "../utils"
import "../styles/PopChildren.css"

// 메인 컴포넌트
const PopChildren: React.FC<PopEffectProps> = ({
  children,
  stackOnGround = false,
  groundY = window.innerHeight - 100,
  maxStackedItems = 50,
  spawnInterval = 50,
}) => {
  // 상태 및 ref 관리
  const [clones, setClones] = useState<CloneItem[]>([])
  const isPressingRef = useRef(false) // 마우스 버튼 누르고 있는 상태 관리
  const spawnTimerRef = useRef<NodeJS.Timeout>() // 생성 간격 관리용 타이머
  const containerRef = useRef<HTMLDivElement>(null) // 컨테이너 참조
  const mousePositionRef = useRef({ x: 0, y: 0 }) // 마우스 위치 정보
  const duration = 1.5 // 요소 유지 시간

  // 복제 요소 생성 함수
  const createClone = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const { style, finalPosition } = calculateCloneStyle(clientX, clientY, stackOnGround, groundY)

      const newClone: CloneItem = {
        createdAt: Date.now() + Math.random(),
        style,
        finalPosition,
      }

      setClones((prev) => {
        const updatedClones = [...prev, newClone]
        return stackOnGround
          ? getStackedClones(updatedClones, maxStackedItems)
          : getPersistentClones(updatedClones, duration)
      })
    },
    [groundY, maxStackedItems]
  )

  // 연속 생성 시작 함수 (마우스를 누르고 있는 동안 생성)
  const startCreatingClones = useCallback(() => {
    if (spawnTimerRef.current) return // 이미 생성 중이면 종료
    isPressingRef.current = true
    // 초기 생성
    createClone(mousePositionRef.current.x, mousePositionRef.current.y)

    // 생성 간격 마다 생성
    spawnTimerRef.current = setInterval(() => {
      if (isPressingRef.current) {
        createClone(mousePositionRef.current.x, mousePositionRef.current.y)
      }
    }, spawnInterval)
  }, [createClone, spawnInterval])

  // 연속 생성 중지 함수
  const stopCreatingClones = useCallback(() => {
    isPressingRef.current = false
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current)
      spawnTimerRef.current = undefined
    }
  }, [])

  // 마우스 이벤트 핸들러들
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      createClone(e.clientX, e.clientY)
    },
    [createClone]
  )

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

  // 전역 마우스 이벤트 리스너 설정
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (isPressingRef.current) {
        mousePositionRef.current = getPositionFromEvent(e)
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("touchmove", handleGlobalMouseMove)

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current)
      }
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("touchmove", handleGlobalMouseMove)
    }
  }, [])

  // 렌더링
  return (
    <div ref={containerRef} className="pop-container">
      <div
        onClick={handleClick}
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

export default PopChildren
