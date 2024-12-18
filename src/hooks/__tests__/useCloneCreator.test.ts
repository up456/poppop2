import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { useCloneCreator } from "../useCloneCreator"
import { AnimationEnum } from "../../animations"

describe("useCloneCreator", () => {
  const defaultProps = {
    isStackable: true,
    maxStackedItems: 5,
    spawnInterval: 100,
    animationType: AnimationEnum.EXPLOSIVE,
    groundY: 500,
    range: 100,
    elementWidth: 50,
    elementHeight: 50,
    duration: 1000,
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("초기 상태에서는 클론이 없어야 합니다", () => {
    const { result } = renderHook(() => useCloneCreator(defaultProps))
    expect(result.current.clones).toHaveLength(0)
  })

  it("startCreatingClones 호출 시 클론이 생성되어야 합니다", () => {
    const { result } = renderHook(() => useCloneCreator(defaultProps))

    act(() => {
      result.current.startCreatingClones()
    })

    expect(result.current.clones).toHaveLength(1)
  })

  it("maxStackedItems 제한이 제대로 작동해야 합니다", () => {
    const { result } = renderHook(() => useCloneCreator(defaultProps))

    // maxStackedItems(5)보다 많은 클론을 생성
    act(() => {
      result.current.startCreatingClones()
      // 추가로 5번의 interval 동안 클론 생성
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(defaultProps.spawnInterval)
      }
    })

    // maxStackedItems에 의해 클론이 5개로 제한되어야 함
    expect(result.current.clones).toHaveLength(defaultProps.maxStackedItems)
  })

  it("isStackable이 false일 때는 maxStackedItems 제한이 적용되지 않아야 합니다", () => {
    const nonStackableProps = {
      ...defaultProps,
      isStackable: false,
    }
    const { result } = renderHook(() => useCloneCreator(nonStackableProps))

    act(() => {
      result.current.startCreatingClones()
      // maxStackedItems(5)보다 많은 클론을 생성
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(defaultProps.spawnInterval)
      }
    })

    // isStackable이 false이므로 maxStackedItems와 관계없이 모든 클론이 유지되어야 함
    expect(result.current.clones.length).toBeGreaterThan(defaultProps.maxStackedItems)
  })
})
