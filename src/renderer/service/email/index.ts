const { ipcRenderer } = (window as any)?.electron;

async function sendEmail(to: string, subject: string, text: string, html?: string, attachments?: { filename: string, content: ArrayBuffer }[]) {
  console.log('hey hey hey this is send email function');
  await ipcRenderer.invoke('service:call', 'EmailService', 'sendEmail', to, subject, text, html,attachments);
}

export {
  sendEmail
}
