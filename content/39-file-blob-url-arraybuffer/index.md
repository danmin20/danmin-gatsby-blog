---
emoji: ⚠️
title: '<Blob File URL ArrayBuffer> 그들의 사각관계?! ~이미지 업로드 미리보기를 구현하고 싶습니다~ : 1탄'
date: '2023-06-18'
categories: Dev
---

> ~침착맨 라이트노벨 제목 월드컵 편을 보고 재밌어서 써본 제목입니다~

![](0.jpeg)

&nbsp;

파일을 다루는 일이 생길 때마다 구글링을 하게 되는 것 같다. ~나만 그런 거 아니겠지?~

![](1.gif)

여튼 그래서 들고와 본 주제!

![](2.png)

&nbsp;

## Blob, File, 그리고 URL

File, Blob, 그리고 URL은 웹 애플리케이션에서 파일과 데이터를 표현하고 다루는 데 사용되는 개념들이다.

### Blob
Blob은 일련의 데이터를 나타내는 객체다. Blob은 Binary Large Object의 약자로, 텍스트나 이미지, 오디오, 비디오 등과 같은 다양한 종류의 데이터를 처리할 수 있다. File 객체는 Blob 객체의 하위 클래스로 볼 수 있다.

### File
File은 사용자의 로컬 파일 시스템에서 선택한 파일을 나타내는 객체다. 일반적으로 파일 업로드나 파일 조작을 위해 사용된다. File 객체는 Blob 객체를 상속하며, 파일의 이름, 크기, 타입 등의 추가적인 정보를 가지고 있다.

### URL
URL은 웹 리소스의 주소를 나타내는 문자열이다. URL은 `createObjectURL()`을 사용하여 Blob 또는 File 객체를 URL로 변환할 수 있다. 변환된 URL은 해당 Blob 또는 File 객체를 가리키는 유효한 주소로 사용될 수 있다.

### ArrayBuffer
ArrayBuffer는 일련의 바이너리 데이터를 나타내는 고정 크기 버퍼다. ArrayBuffer는 일반적으로 바이너리 데이터를 처리하고 다루는 데 사용된다. 주로 TypedArray 및 DataView와 함께 사용되며, 데이터를 다양한 형식으로 읽고 쓸 수 있는 메모리 버퍼로 동작한다.

&nbsp;

문제는 이 넷들을 서로 변환해야 하는 일이 생긴다는 것..!

&nbsp;

## File, Blob, URL, ArrayBuffer 간 변환 방법

### 1. File 👉 Blob
이 경우엔 별도의 과정이 필요없다. File 객체가 Blob 객체를 상속하기 때문에 바로 Blob으로 사용할 수 있다.

```ts
// File to Blob
const file: File = /* 로컬 파일 선택 등을 통해 얻은 File 객체 */;
const blob: Blob = file;
```

&nbsp;

### 2. Blob 👉 File
`new File()`을 사용하여 Blob 객체를 감싸면 된다. File 생성자의 첫 번째 매개변수로 Blob 객체 또는 Blob 배열을 전달하고, 파일 이름과 MIME 타입을 지정한다.

```ts
// Blob to File
const blob: Blob = /* 데이터 등을 통해 얻은 Blob 객체 */;
const fileName: string = 'example.txt';
const fileType: string = 'text/plain';
const convertedFile: File = new File([blob], fileName, { type: fileType });
```

&nbsp;

### 3. File/Blob 👉 URL
`URL.createObjectURL()`을 사용하면 된다. 이 메서드는 Blob 또는 File 객체를 매개변수로 받아서 해당 객체를 가리키는 URL을 생성한다.

```ts
// File/Blob to URL
const blob: Blob = /* 데이터 등을 통해 얻은 Blob 객체 */;
const url: string = URL.createObjectURL(blob);
```

&nbsp;

### 4. URL 👉 Blob
`fetch()`를 사용하여 URL로부터 데이터를 가져온 다음, `response.blob()`을 호출하여 Blob 객체로 변환하면 된다. 이를 통해 URL로부터 파일의 데이터를 비동기적으로 가져올 수 있다.

```ts
// URL to Blob
const url: string = /* URL */;
const response = await fetch(url);
const blob = await response.blob();
```

&nbsp;

### 5. ArrayBuffer 👉 Blob
ArrayBuffer를 사용하여 데이터를 생성한 후, Blob 객체로 변환할 수 있다.

```ts
// ArrayBuffer to Blob
const arrayBuffer: ArrayBuffer = /* 데이터 등을 통해 얻은 ArrayBuffer */;
const blob = new Blob([arrayBuffer]);
```

&nbsp;

### 6. File/Blob 👉 ArrayBuffer
Blob 또는 Blob을 ArrayBuffer로 변환하기 위해서는 FileReader를 사용하여 비동기적으로 데이터를 읽어와야 한다.

```ts
// File/Blob to ArrayBuffer
const blob: Blob = /* 데이터 등을 통해 얻은 Blob 객체 */;
const fileReader = new FileReader();

fileReader.onload = function(event) {
  const arrayBuffer = event.target.result;

  // ArrayBuffer를 사용한 데이터 처리 로직
  // 이미지 데이터의 픽셀 값을 읽거나, 오디오 데이터를 재생하거나, 파일 형식을 파싱하는 등..
};

fileReader.readAsArrayBuffer(blob);
```

&nbsp;

### 7. URL 👉 ArrayBuffer
```ts
// URL to ArrayBuffer
const urlToBuffer = async(url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    // 에러 처리
    console.error('Error:', error);
    return null;
  }
}

const url: string = /* URL */;
const arrayBuffer = await urlToBuffer(url);
if (arrayBuffer) {
  // ArrayBuffer를 사용한 데이터 처리 로직
  // 이미지 데이터의 픽셀 값을 읽거나, 오디오 데이터를 재생하거나, 파일 형식을 파싱하는 등..
}
```

이미지 업로드 미리보기 구현은 2탄에서 작성해보도록 하겠다!

![](3.webp)

```toc
```