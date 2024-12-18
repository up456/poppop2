import { useCallback, useRef, useState, useEffect } from "react"
import { getAnimationStyleCalculator } from "../animations"
import { getStackedClones, getPersistentClones } from "../utils"
import { AnimationType } from "../animations"

// 복제된 요소의 상태 타입 정의
export type CloneItemType = {
  createdAt: number
  style: React.CSSProperties
  finalPosition?: { x: number; y: number } // 최종 위치
}

export type UseCloneCreatorProps = {
  isStackable: boolean
  maxStackedItems: number
  spawnInterval: number
  animationType: AnimationType
  groundY: number
  range: number
  elementWidth: number
  elementHeight: number
  duration: number
}

export const useCloneCreator = ({
  isStackable,
  maxStackedItems,
  spawnInterval,
  animationType,
  groundY,
  range,
  elementWidth,
  elementHeight,
  duration,
}: UseCloneCreatorProps) => {
  const [clones, setClones] = useState<CloneItemType[]>([])
  const isPressingRef = useRef(false)
  const spawnTimerRef = useRef<number | undefined>(undefined)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  const createClone = useCallback(
    (clientX: number, clientY: number) => {
      const cursorX = clientX + window.scrollX
      const cursorY = clientY + window.scrollY

      const { style, finalPosition } = getAnimationStyleCalculator(animationType)({
        cursorX,
        cursorY,
        isStackable,
        elementWidth,
        elementHeight,
        groundY,
        range,
      })

      const newClone: CloneItemType = {
        createdAt: Date.now() + Math.random(),
        style,
        finalPosition,
      }

      setClones((prev) => {
        const updatedClones = [...prev, newClone]
        return isStackable
          ? getStackedClones(updatedClones, maxStackedItems)
          : getPersistentClones(updatedClones, duration)
      })
    },
    [groundY, maxStackedItems, elementWidth, elementHeight, isStackable, animationType, range, duration]
  )

  const startCreatingClones = useCallback(() => {
    if (spawnTimerRef.current) return
    isPressingRef.current = true

    let lastSpawnTime = 0
    const animate = (currentTime: number) => {
      if (!isPressingRef.current) return

      // 현재 시간 - 마지막 생성 시간이 spawnInterval보다 크면 === 생성주기가 되었다는 뜻
      if (currentTime - lastSpawnTime >= spawnInterval) {
        createClone(mousePositionRef.current.x, mousePositionRef.current.y)
        lastSpawnTime = currentTime
      }
      spawnTimerRef.current = requestAnimationFrame(animate)
    }

    spawnTimerRef.current = requestAnimationFrame(animate)
  }, [createClone, spawnInterval])

  const stopCreatingClones = useCallback(() => {
    isPressingRef.current = false
    if (spawnTimerRef.current) {
      cancelAnimationFrame(spawnTimerRef.current)
      spawnTimerRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) {
        cancelAnimationFrame(spawnTimerRef.current)
        spawnTimerRef.current = undefined
      }
    }
  }, [])

  return {
    clones,
    mousePositionRef,
    startCreatingClones,
    stopCreatingClones,
  }
}
