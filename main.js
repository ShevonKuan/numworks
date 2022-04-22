// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const isMac = process.platform === 'darwin'

const template = [
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            { role: 'about' },
            isMac ? { role: 'close' } : { role: 'quit' },
            { type: 'separator' },

        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'Tool',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            {
                label: "screenshot",
                click: () => { BrowserWindow.getFocusedWindow().webContents.executeJavaScript("Module.downloadScreenshot()") }
            },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'Help',
        submenu: [
            {
                label: 'Manual',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://www.numworks.com/resources/manual/')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.setAboutPanelOptions({
    applicationName: "Numworks",
    applicationVersion: "18.2.2",
    copyright: "© 2022 Numworks. All rights reserved. NumWorks is a registered trademark. Packaged by ShevonKwan",
})

function createWindow() {
    // Create the browser window.
    const WIDTH = 290
    const HEIGHT = 555
    const mainWindow = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        title: "Numworks",
        icon: "./numworks.ico",
        useContentSize: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    mainWindow.setAspectRatio(mainWindow.getSize()[0] / mainWindow.getSize()[1])
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
