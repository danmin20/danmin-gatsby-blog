import { useEffect, useState } from 'react';

export const useViewCount = (siteUrl: string, key: string) => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (!siteUrl) return;
    const namespace = siteUrl.replace(/(^\w+:|^)\/\//, '');

    fetch(
      `https://api.countapi.xyz/${process.env.NODE_ENV === 'development' ? 'get' : 'hit'}/${namespace}/${key}`,
    ).then(async (result) => {
      const data = await result.json();
      setViewCount(data.value);
    });
  }, [siteUrl, key]);

  return { viewCount };
};
