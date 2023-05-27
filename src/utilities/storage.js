const APPLICATION_SESSION = 'APPLICATION_SESSION';

export function getApplicationStorage() {
  const _session = sessionStorage.getItem(APPLICATION_SESSION);
  const parsedData = JSON.parse(_session);
  return parsedData;
}

export function storeIntoApplicationStorage(data) {
  const stringifiedData = JSON.stringify(data);
  sessionStorage.setItem(APPLICATION_SESSION, stringifiedData);
}

export function clearApplicationStorage() {
  sessionStorage.removeItem(APPLICATION_SESSION);
}