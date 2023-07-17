---
emoji: 👀
title: '<Blob File URL ArrayBuffer> 그들의 사각관계?! ~이미지 업로드 미리보기를 구현하고 싶습니다~ : 2탄'
date: '2023-06-19'
categories: Dev
---

[1탄의 내용](https://www.jeong-min.com/39-file-blob-url-arraybuffer/)을 참고하여 이미지 업로드 미리보기를 구현해보자. 놀랍게도 그 방법은 한두 개가 아니다!

![](0.jpeg)

&nbsp;

## 1. URL.createObjectURL

> 참고 자료: [MDN web docs: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

`URL.createObjectURL` 메서드를 사용하여 선택한 이미지 파일을 Blob 또는 File 객체로 변환하고, 그 객체를 URL로 변환하여 미리보기 이미지로 사용할 수 있다. 이 방법은 메모리 사용량이 적고 효율적이다. 하지만 URL은 사용이 완료되면 `URL.revokeObjectURL`을 호출하여 메모리 해제를 해주어야 한다.

```tsx
const ImageUploadPreview: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewImage && <img src={previewImage} alt="Preview" style={{ width: '200px', height: '200px' }} />}
    </div>
  );
};
```

**장점**
- 간단하고 직관적인 방법으로 이미지를 미리보기할 수 있다.
- 추가적인 데이터 변환이나 처리 없이 바로 URL을 생성하여 사용할 수 있다.
- 메모리 관리에 대한 부담이 적다.

**단점**
- 생성된 URL은 페이지 세션이나 브라우저 세션 동안 유지되며, 페이지를 벗어나도 자동으로 해제되지 않는다.
- 큰 이미지 파일을 다룰 경우 메모리 사용량이 늘어날 수 있다.

&nbsp;

## 2. FileReader.readAsDataURL

> 참고 자료: [MDN web docs: FileReader.readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)

FileReader 객체의 `readAsDataURL` 메서드를 사용하여 이미지 파일을 Base64 인코딩된 데이터 URL로 읽어올 수 있다. 이 방법은 동기적으로 작동하며, 파일의 전체 내용을 포함한 데이터 URL을 생성한다. 큰 파일의 경우 메모리 사용량이 높을 수 있다.

```tsx
const ImageUploadPreview: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewImage && <img src={previewImage} alt="Preview" style={{ width: '200px', height: '200px' }} />}
    </div>
  );
};
```

**장점**
- 간단하게 이미지를 Base64 데이터 URL로 변환하여 미리보기할 수 있다.
- Blob URL보다는 메모리 사용량이 적다.

**단점**
- 이미지가 큰 경우 Base64 데이터의 크기가 커질 수 있어 성능에 영향을 줄 수 있다.
- 데이터 URL은 Base64 인코딩된 문자열이므로 이미지 파일의 용량이 더욱 커질 수 있다.

&nbsp;

## 3. FileReader.readAsArrayBuffer

> 참고 자료: [MDN web docs: FileReader.readAsArrayBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer)

FileReader 객체의 `readAsArrayBuffer` 메서드를 사용하여 이미지 파일을 ArrayBuffer로 읽어올 수 있다. 이후, Uint8Array를 활용하여 ArrayBuffer를 다루고, 이미지 파일의 일부만을 사용하여 미리보기를 생성할 수 있다.

```tsx
const ImageUploadPreview: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: file.type });
        const imageUrl = URL.createObjectURL(blob);
        setPreviewImage(imageUrl);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewImage && <img src={previewImage} alt="Preview" style={{ width: '200px', height: '200px' }} />}
    </div>
  );
};

```

**장점**
- 이미지 파일의 ArrayBuffer 데이터를 직접 다룰 수 있어 추가적인 처리가 가능하다. (이미지 크기 조절, 특정 데이터 추출 등)

**단점**
- 별도의 처리가 필요하며, ArrayBuffer를 활용한 추가적인 작업이 필요하다.
- 큰 이미지 파일을 다룰 경우 메모리 사용량이 늘어날 수 있다.

&nbsp;

## 4. Canvas

> 참고 자료: [MDN web docs: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)

선택한 이미지 파일을 `HTMLCanvasElement에` 그려서 미리보기를 생성할 수 있다. canvas 요소에 선택한 이미지를 그리고, canvas에서 이미지 데이터를 가져와서 미리보기로 사용할 수 있다.

```tsx
const ImageUploadPreview: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
              const imageUrl = canvas.toDataURL('image/png');
              setPreviewImage(imageUrl);
            }
          }
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 200;
      canvas.height = 200;
    }
  }, []);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {previewImage && <img src={previewImage} alt="Preview" style={{ width: '200px', height: '200px' }} />}
    </div>
  );
};
```

**장점**
- 이미지를 렌더링하고 조작하는 유연한 방법이다.
- 이미지 크기 조절, 필터 적용, 이미지 편집 등 다양한 작업이 가능하다.

**단점**
- 브라우저에서 Canvas를 다루는 작업은 CPU 리소스를 많이 사용할 수 있다.
- Canvas를 사용하는 추가적인 작업이 필요하다.

&nbsp;

## 5. 외부 라이브러리

> 참고 자료: [react-dropzone](https://react-dropzone.js.org/)

이미지 업로드 미리보기를 구현하는 데 도움이 되는 많은 라이브러리들이 있다. `react-dropzone`을 한번 사용해보도록 하겠다.

```tsx
import { useDropzone } from 'react-dropzone';

const ImageUploadPreview: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the image here...</p> : <p>Drag and drop an image here, or click to select an image</p>}
      </div>
      {previewImage && <img src={previewImage} alt="Preview" style={{ width: '200px', height: '200px' }} />}
    </div>
  );
};

export default ImageUploadPreview;
```

**장점**
- 드래그 앤 드롭 기능이 쉽게 구현되어 있어 사용자 경험이 향상된다.
- 미리보기 이미지 외에도 파일 업로드와 관련된 다양한 기능을 제공한다.

**단점**
- 추가적인 라이브러리를 사용해야 하므로 프로젝트의 의존성이 늘어날 수 있다.
- 커스터마이징이 제한될 수 있다.

&nbsp;

구현해야 하는 서비서의 목적과 기능 요구사항을 고려하여 적절한 방법을 선택하도록 하자!

![](1.webp)

```toc
```