export default function Modal() {
  const cancelButton = document.querySelector('.button.cancel')
  cancelButton.addEventListener('click', close)

  function open() {
    //Função para add classe active para modal-wrapper
    document.querySelector('.modal-wrapper').classList.add('active')
  }
  function close() {
    //Função para remover classe active para modal-wrapper
    document.querySelector('.modal-wrapper').classList.remove('active')
  }
  return {
    open,
    close
  }
}
