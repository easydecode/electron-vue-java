/* ********************************* 菜单栏 ************************** */
import { Menu } from 'electron'
const template = [
  {
    label: '编辑',
    submenu: [
      { id: 1, label: '撤销', role: 'undo' },
      { id: 2, label: '重做', role: 'redo' },
      { id: 3, role: 'separator', label: '----------' },
      { id: 4, label: '剪切', role: 'cut' },
      { id: 5, label: '复制', role: 'copy' },
      { id: 6, label: '粘贴', role: 'paste' },
      { id: 7, label: '删除', role: 'delete' },
      { id: 8, label: '全选', role: 'selectAll' }
    ]
  },
  {
    label: '视图',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       { role: 'about' },
//       { type: 'separator' },
//       { role: 'services', submenu: [] },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideothers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' }
//     ]
//   })

//   // Edit menu
//   template[1].submenu.push(
//     { type: 'separator' },
//     {
//       label: 'Speech',
//       submenu: [
//         { role: 'startspeaking' },
//         { role: 'stopspeaking' }
//       ]
//     }
//   )

//   // Window menu
//   template[3].submenu = [
//     { role: 'close' },
//     { role: 'minimize' },
//     { role: 'zoom' },
//     { type: 'separator' },
//     { role: 'front' }
//   ]
// }

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

/* **************************************************** */
