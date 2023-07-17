---
emoji: 📂
title: 'file과 json data를 formData에 같이? 따로! 넣어보자'
date: '2023-05-17'
categories: Dev
---

> ~제목을 'form생form사'로 하고 싶었으나 처참히 실패~

폼과 관련된 서버 통신 작업을 할 때, 보통은 이미지를 업로드하는 api와 폼데이터를 전송하는 api를 함께 사용해 서버로 데이터를 전송하곤 했다. 그러던 어느 날, 파일은 파일대로 json data는 json 대로 넣어서 하나의 api를 사용해 같이 전송해달라는 서버 개발자의 요청을 받게 되었는데...

![](1.png)

&nbsp;

## FormData란?

FormData는 HTML 폼 데이터로, 폼을 쉽게 보내도록 도와주는 객체다. 네트워크 메서드의 바디에 FormData 객체를 넣으면, HTTP 메시지는 인코딩되고 `Content-Type` 속성은 `multipart/form-data`로 지정된 후 전송된다.

&nbsp;

## 어떻게 동시에, 따로 보내야 하지?

그냥 다짜고짜 파일과 함께 보냈더니, `415 (Unsupported Media Type)` 에러가 발생했다. 그래서 file은 multipart/form-data, 그 외의 데이터는 application/json 형식으로 따로 보내기 위해 Blob을 사용해주었다.

> Blob(Binary Large Object)은 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용된다.

```ts
const data = methods.getValues(); // react-hook-form

const formData = new FormData();

formData.append(
   'data',
   new Blob([JSON.stringify(data)], { type: 'application/json' })
);

Object.entries(data).forEach(([key, value]) => {
   if (value.type === 'file') {
      // value: {type: string, value: File}
      formData.append(key, value.value); 
   }
});
```

위와 같이 코드를 수정한 후 데이터를 전송하니, data 내부에는 json 데이터가, 파일은 각각의 `key, value` 형태로 잘 들어가는 것을 확인할 수 있었다.

```toc
```