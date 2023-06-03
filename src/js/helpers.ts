import { TIMEOUT_SEC } from './config';
import { RecipeUpload } from './model';

const timeout = function (s: number) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url: string, uploadData?: RecipeUpload) {
  try {
    const fetchPro: Promise<any> = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = (await Promise.race([
      fetchPro,
      timeout(TIMEOUT_SEC),
    ])) as Response;
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message}(${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
