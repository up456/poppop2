# poppop2 소개

클릭 시 요소가 복제되어 튀어나오는 애니메이션을 부여하는 React 컴포넌트 라이브러리입니다.



## 설치 방법

```shell
npm install poppop2
```


## 사용 방법

```tsx
import { PopChildren } from "poppop2"
<PopChildren >
  <button>Pop하고 싶은 요소 무엇이든 넣으세요!</button>
</PopChildren>
```
## props

| 속성 | 타입 | 설명 |
|------|------|------|
| isStackable | boolean | 요소들이 쌓일 수 있는지 여부를 결정합니다 |
| maxStackedItems | number | 최대로 쌓일 수 있는 요소의 개수를 지정합니다 |
| spawnInterval | number | 요소가 생성되는 간격을 밀리초 단위로 지정합니다 |
| animationType | AnimationType | 애니메이션 타입을 지정합니다 |
| groundY | number | 요소가 착지하는 Y축 위치를 지정합니다 |
| range | number | 요소가 튀어나가는 범위를 지정합니다 |
| elementWidth | number | 요소의 너비를 픽셀 단위로 지정합니다 |
| elementHeight | number | 요소의 높이를 픽셀 단위로 지정합니다 |
| duration | number | 애니메이션 지속 시간을 밀리초 단위로 지정합니다 |


## 비지원 범위
- SSR 지원하지 않습니다. 반드시 클라이언트 컴포넌트에서만 사용해야 합니다. (에러 발생)
- iframe와 video는 지원하지 않습니다. (비정상 작동)

## 라이선스

[MIT license](./LICENSE.md)를 따릅니다.