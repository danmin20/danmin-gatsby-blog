import React, { createRef, ReactNode, useEffect, useRef } from 'react';

const src = 'https://utteranc.es/client.js';
const branch = 'master';

type UtterancesProps = {
  repo: string;
  path: string;
};

const Utterances: React.FC<UtterancesProps> = ({ repo, path }) => {
  const rootElm = createRef<HTMLDivElement>();
  const isUtterancesLoaded = useRef(false);

  useEffect(() => {
    if (!rootElm.current || isUtterancesLoaded.current) return;
    const storedIsDarkMode = localStorage.getItem('isDarkMode') ?? '';

    const utterances = document.createElement('script');
    const utterancesConfig: { [key: string]: unknown } = {
      src,
      repo,
      branch,
      'theme': storedIsDarkMode ? 'photon-dark' : 'github-light',
      'label': 'comment',
      'async': true,
      'issue-term': 'pathname',
      'crossorigin': 'anonymous',
    };

    Object.keys(utterancesConfig).forEach((configKey) => {
      utterances.setAttribute(configKey, utterancesConfig[configKey] as string);
    });
    rootElm.current.appendChild(utterances);
    isUtterancesLoaded.current = true;
  }, [repo, rootElm, path]);

  return <div className='utterances' ref={rootElm} />;
};

export default Utterances;
