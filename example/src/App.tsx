import React from "react"
import { PopChildren } from "../../src"
import { AnimationEnum } from "../../src/animations"
import "./App.css"

function App() {
  return (
    <div className="app">
      <h1>React Pop Effect 테스트</h1>

      <div className="container">
        <div className="example-box">
          <h3>기본 효과 (날아가기)</h3>
          <PopChildren>
            <button className="pop-button">클릭하거나 누르고 있어보세요!</button>
          </PopChildren>
        </div>

        <div className="example-box">
          <h3>바닥에 쌓이는 효과</h3>
          <PopChildren isStackable maxStackedItems={100} spawnInterval={100} range={400} groundY={3000}>
            <div className="box">여기도 클릭해보세요!</div>
          </PopChildren>
        </div>

        <div className="example-box">
          <h3 className="margin-bottom-3">확산 효과</h3>
          <PopChildren
            spawnInterval={30}
            maxStackedItems={50}
            animationType={AnimationEnum.SPREAD}
            isStackable
            range={500}
          >
            <div className="heart">
              <span className="heart-text">확산!</span>
            </div>
          </PopChildren>
        </div>
      </div>
    </div>
  )
}

export default App
