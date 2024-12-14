import React, { useState } from "react"
import { PopChildren } from "../../src"
import "./App.css"

function App() {
  return (
    <div className="app">
      <h1>React Pop Effect 테스트</h1>

      <div className="card">
        <div className="example-row">
          <h3>기본 효과 (날아가기)</h3>
          <PopChildren>
            <button className="pop-button">클릭하거나 누르고 있어보세요!</button>
          </PopChildren>
        </div>

        <div className="example-row">
          <h3>바닥에 쌓이는 효과</h3>
          <PopChildren onStack maxStackedItems={30} spawnInterval={100}>
            <div className="box">여기도 클릭해보세요!</div>
          </PopChildren>
        </div>

        <div className="example-row">
          <h3>빠른 생성 효과</h3>
          <PopChildren spawnInterval={30}>
            <div className="circle">빠르게!</div>
          </PopChildren>
        </div>
      </div>
    </div>
  )
}

export default App
