export const fetchData = async url => {
  try {
    const FULL_URL = 'https://jindonyy.github.io/fe-shopping/' + url;
    const response = await fetch(FULL_URL);
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
