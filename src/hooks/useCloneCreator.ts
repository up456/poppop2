import { useCallback, useRef, useState, useEffect } from "react"
import { getAnimationStyleCalculator } from "../animations"
import { getStackedClones, getPersistentClones } from "../utils"
import { AnimationEnum } from "../animations"

// 복제된 요소의 상태 타입 정의
export type CloneItemType = {
  createdAt: number
  style: React.CSSProperties
  finalPosition?: { x: number; y: number } // 최종 위치
}

type UseCloneCreatorProps = {
  onStack: boolean
  maxStackedItems: number
  spawnInterval: number
  animationType: AnimationEnum
  groundY: number
  range: number
  elementWidth: number
  elementHeight: number
  duration: number
}

export const useCloneCreator = ({
  onStack,
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
  const spawnTimerRef = useRef<NodeJS.Timeout>()
  const mousePositionRef = useRef({ x: 0, y: 0 })

  const createClone = useCallback(
    (clientX: number, clientY: number) => {
      const { style, finalPosition } = getAnimationStyleCalculator(animationType)({
        clientX,
        clientY,
        onStack,
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
        return onStack ? getStackedClones(updatedClones, maxStackedItems) : getPersistentClones(updatedClones, duration)
      })
    },
    [groundY, maxStackedItems, elementWidth, elementHeight, onStack, animationType, range, duration]
  )

  const startCreatingClones = useCallback(() => {
    if (spawnTimerRef.current) return
    isPressingRef.current = true
    createClone(mousePositionRef.current.x, mousePositionRef.current.y)

    spawnTimerRef.current = setInterval(() => {
      if (isPressingRef.current) {
        createClone(mousePositionRef.current.x, mousePositionRef.current.y)
      }
    }, spawnInterval)
  }, [createClone, spawnInterval])

  const stopCreatingClones = useCallback(() => {
    isPressingRef.current = false
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current)
      spawnTimerRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current)
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
