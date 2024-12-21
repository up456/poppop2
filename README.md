# poppop2 소개

클릭 시 요소가 복제되어 튀어나오는 애니메이션을 부여하는 React 컴포넌트 라이브러리입니다.



https://github.com/user-attachments/assets/41195858-7512-4724-bc7c-daba046178b2



## 설치 방법

```shell
npm install poppop2
```


## 사용 방법

```tsx
import { PopChildren } from "poppop2"
<PopChildren >
  // Pop하고 싶은 요소 무엇이든 넣으세요!
  <button>버튼</button>
</PopChildren>
```
## props

| 속성 | 타입 | 기본값 | 설명 | 비고 |
|------|------|------|------|------|
| isStackable | boolean | false | 요소들이 사라지지 않고 쌓일 수 있는지 여부를 결정합니다 |
| maxStackedItems | number | 50 | isStackable이 true일 때, 최대로 쌓일 수 있는 요소의 개수를 지정합니다 |
| spawnInterval | number | 150 | 요소가 생성되는 간격을 밀리초 단위로 지정합니다 |
| animationType | AnimationType | "explosive" | 애니메이션 타입을 지정합니다  | 종류: "explosive", "spread"|
| groundY | number | 페이지 높이 - 100 |  요소가 착지하는 Y축 위치를 지정합니다 | "explosive" type에서만 동작|
| range | number | 100 | 요소의 퍼짐 정도를 지정합니다 |


## 미지원 범위
- React만 지원합니다. 다른 프레임워크 및 메타프레임워크(Next.js)도 지원하지 않습니다.
- iframe와 video는 지원하지 않습니다. (비정상 작동)

## 라이선스

[MIT license](./LICENSE.md)를 따릅니다.
