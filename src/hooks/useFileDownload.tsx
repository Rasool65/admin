import { useState } from 'react';
import useHttpRequest from './useHttpRequest';

const useFileDownload = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { getRequest } = useHttpRequest();

  const downloadFile = (baseUrl, url, query) => {
    setLoading(true);

    getRequest(`${baseUrl}${url}?${query}`)
      .then((resp) => {
        const urls = `${baseUrl}${resp.data.url}`;
        const a = document.createElement('a');
        a.href = urls;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);

        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  return {
    downloadFile,
  };
};
export default useFileDownload;
