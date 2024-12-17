"use client"

import { PopChildren, AnimationEnum } from "poppop2"
import "./page.css"

export default function Home() {
  return (
    <div className="app">
      <h1>React Pop Effect 테스트</h1>

      <div className="container">
        <div className="example-box">
          <h3>폭발 효과 (기본 효과)</h3>
          <PopChildren>
            <button className="pop-button">클릭하거나 누르고 있어보세요!</button>
          </PopChildren>
        </div>

        <div className="example-box">
          <h3>폭발 + 쌓임 </h3>
          <PopChildren isStackable maxStackedItems={100} range={400} groundY={3000}>
            <div className="box">여기도 클릭해보세요!</div>
          </PopChildren>
        </div>

        <div className="example-box">
          <h3 className="margin-bottom-3"> 확산 + 쌓임</h3>
          <PopChildren maxStackedItems={50} animationType={AnimationEnum.SPREAD} isStackable range={500}>
            <div className="heart">
              <span className="heart-text">사랑해!</span>
            </div>
          </PopChildren>
        </div>
        <div className="example-box">
          <h3>빠른 + 확산 효과</h3>
          <PopChildren spawnInterval={20} maxStackedItems={50} animationType={AnimationEnum.SPREAD}>
            <div className="circle">빠르다</div>
          </PopChildren>
        </div>
      </div>
    </div>
  )
}
