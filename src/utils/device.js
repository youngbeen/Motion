export const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
export const Android = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
