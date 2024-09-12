const { ipcRenderer } = (window as any)?.electron;

async function signIn(username: string, password: string) {
  console.log('hey hey hey this is send email function');
  return await ipcRenderer.invoke('service:call', 'LoginService', 'signIn', username, password);
}

export {
  signIn
}
