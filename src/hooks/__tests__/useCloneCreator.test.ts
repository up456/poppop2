import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { useCloneCreator } from "../useCloneCreator"
import { UseCloneCreatorProps } from "../useCloneCreator"

describe("useCloneCreator", () => {
  const defaultProps: UseCloneCreatorProps = {
    isStackable: true,
    maxStackedItems: 5,
    spawnInterval: 100,
    animationType: "explosive",
    groundY: 500,
    range: 100,
    elementWidth: 50,
    elementHeight: 50,
    duration: 1000,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(cb, 0)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("초기 상태에서는 클론이 없어야 합니다", () => {
    const { result } = renderHook(() => useCloneCreator(defaultProps))
    expect(result.current.clones).toHaveLength(0)
  })
})
