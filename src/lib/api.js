const { default: axios } = require("axios");

const api = axios.create({
  baseURL: "/api", //might be changed later

  timeout: 10000,
});
export const fetchNewsByCountry = async (countryCode) => {
  try {
    const response = await api.get(`/news/${countryCode}`);
    return response.data;
  } catch (error) {
    console.log("error in fetching problem");
  }
};

//countrycodee
