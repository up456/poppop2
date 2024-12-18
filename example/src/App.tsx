"use client"

import { PopChildren } from "poppop2"
import "./App.css"

export default function Home() {
  return (
    <div className="app">
      <h1 className="title">React Pop Effect 테스트</h1>

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
          <PopChildren maxStackedItems={50} animationType="spread" isStackable range={500}>
            <div className="heart">
              <span className="heart-text">사랑해!</span>
            </div>
          </PopChildren>
        </div>
        <div className="example-box">
          <h3>빠른 + 확산 효과</h3>
          <PopChildren spawnInterval={20} maxStackedItems={50} animationType="spread">
            <div className="circle">빠르다</div>
          </PopChildren>
        </div>
        <div className="example-box">
          <h3>svg</h3>
          <PopChildren spawnInterval={20} maxStackedItems={50} animationType="spread">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-2 -2 28 28"
              fill="yellow"
              stroke="yellow"
              className="circle"
            >
              <path
                fillRule="evenodd"
                d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                clipRule="evenodd"
              />
            </svg>
          </PopChildren>
        </div>
        <div className="example-box">
          <h3>image</h3>
          <PopChildren spawnInterval={20} maxStackedItems={50} animationType="spread">
            <img
              className="circle"
              src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </PopChildren>
        </div>
      </div>
    </div>
  )
}
