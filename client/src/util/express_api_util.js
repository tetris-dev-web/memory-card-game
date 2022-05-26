export const fetchApiData = (type, payload = {}) => {
  return fetch(`/api/${type}`, payload).then((response) => {
    console.log(response, "response");
    return response
      .json()
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  });
};
