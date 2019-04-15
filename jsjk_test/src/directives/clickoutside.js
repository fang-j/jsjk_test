export default {
  bind (el, { value }) {
    el.handler = e => {
      if (el && !el.contains(e.target)) {
        value(e)
      }
    }
    document.addEventListener('click', el.handler, true)
  },
  unbind (el) {
    document.removeEventListener('click', el.handler, true)
    el.handler = null
  }
}
