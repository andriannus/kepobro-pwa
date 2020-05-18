const api = {
  get: async (url) => {
    try {
      const response = await fetch(url);

      if (response.status === 200) {
        return Promise.resolve(response.json());
      }

      return Promise.reject(new Error(response.statusText));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
