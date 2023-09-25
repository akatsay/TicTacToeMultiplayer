import {useState, useCallback} from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback (async (url, method = 'GET', body = null, headers = {}) =>{
    setLoading(true);
    try{
      if (body){
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {method, body, headers});
      const data = await response.json();
      if(!response.ok){
        if (data.errors)  {
          throw new Error(data.message, {cause: {details: data.errors.msg, origin: data.errors.param}} || 'Unknown request error');
        } else {
          throw new Error(data.message || 'Unknown request error');
        }
      }
      setLoading(false);
      return data;
    }catch(e){
      setLoading(false);
      setError({message: e.message, cause: e.cause});
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {loading, request, error, clearError};
};