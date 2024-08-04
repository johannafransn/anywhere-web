export const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};

export const removeSearchParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export function generateSalt(length: number = 16): number {
  const characters = "0123456789";
  const charactersLength = 4;
  let salt = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    salt += characters.charAt(randomIndex);
  }

  // Assuming you want to convert the string salt to a BigNumberish
  return Number(salt);
}

export const parseQueryUrl = (urlString: string) => {
  const parsedUrl = new URL(urlString);
  const queryString = parsedUrl.search;

  const queryParameters = new URLSearchParams(queryString);

  // convert the query parameters object to a plain JavaScript object
  const queryParamsObject = {};
  for (const [key, value] of queryParameters.entries()) {
    // @ts-ignore
    queryParamsObject[key] = value;
  }
  return queryParamsObject;
};
