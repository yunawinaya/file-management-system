export default {
  mounted(el) {
    const table = el.closest('table')
    if (!table) return

    let startX
    let startWidth
    let resizableColumn = null

    el.querySelectorAll('th').forEach(th => {
      const resizer = document.createElement('div')
      resizer.style.width = '1px'
      resizer.style.height = 'calc(100% - 10px)'
      resizer.style.position = 'absolute'
      resizer.style.right = '0'
      resizer.style.top = '5px'
      resizer.style.cursor = 'col-resize'
      resizer.style.userSelect = 'none'
      resizer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
      resizer.style.zIndex = '10'

      th.style.position = 'relative'
      th.appendChild(resizer)

      resizer.addEventListener('mousedown', e => {
        startX = e.pageX
        resizableColumn = th
        startWidth = resizableColumn.offsetWidth
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      })
    })

    function onMouseMove(e) {
      if (resizableColumn) {
        const newWidth = startWidth + (e.pageX - startX)
        const minWidth = 50
        if (newWidth > minWidth) {
          resizableColumn.style.width = `${newWidth}px`
        }
      }
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      resizableColumn = null
    }
  },
}
