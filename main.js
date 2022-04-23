// Modules to control application life and create native browser window
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    clipboard,
    Notification,
    dialog,
    nativeImage,
} = require("electron");
const path = require("path");

// store
const Store = require("electron-store");
const store = new Store();
function init() {
    return store.get("ionEvents") ? store.get("ionEvents") : [];
}
function update(e) {
    store.set("ionEvents", e);
}

// clipboard
function export_clipboard(e) {
    var o = "";
    e.forEach(function (e) {
        o += String.fromCharCode(e);
    });
    o = btoa(o);
    console.log(e);
    clipboard.writeText(o);
    notification = new Notification({
        title: "Numworks",
        body: "Copied to clipboard",
        silent: true,
    });
    notification.show();
}

function import_clipboard() {
    e = clipboard.readText();
    try {
        e = atob(e);
        var o = [];
        for (var i = 0; i < e.length; i++) {
            d = e.charCodeAt(i);
            if (d > 0 && d < 53) {
                o.push(d);
            } else {
                throw Error;
            }
        }
        update(o);
        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(
            "location.reload();"
        );
        notification = new Notification({
            title: "Numworks",
            body: "Session Import Success",
            silent: true,
        });
        notification.show();
    } catch {
        dialog.showErrorBox("Cannot Import Session", "Session code is invalid");
    }
}

// ipcmain
var data;
ipcMain.on("update", (event, arg) => {
    update(arg);
    data = arg;
});
ipcMain.on("copy", (event, arg) => {
    const image = nativeImage.createFromDataURL(arg);
    clipboard.writeImage(image);
    notification = new Notification({
        title: "Numworks",
        body: "Copy Screenshot Success",
        silent: true,
    });
    notification.show();
});

const isMac = process.platform === "darwin";

const template = [
    // { role: 'fileMenu' }
    {
        label: "File",
        submenu: [
            {
                label: "Import session from clipboard",
                click: () => {
                    import_clipboard();
                },
            },
            {
                label: "Export session to clipboard",
                click: () => {
                    export_clipboard(data);
                },
            },
            { type: "separator" },
            { role: "about" },
            isMac ? { role: "close" } : { role: "quit" },
            { type: "separator" },
        ],
    },
    // { role: 'viewMenu' }
    {
        label: "Tool",
        submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { type: "separator" },

            { type: "separator" },
            {
                label: "Save screenshot",
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript(
                        "Module.downloadScreenshot()"
                    );
                },
            },
            {
                label: "Copy screenshot",
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript(
                        "Module.copyScreenshot()"
                    );
                },
            },
            { type: "separator" },
            { role: "toggleDevTools" },
            {
                label: "reset the calculator",
                click: () => {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript(
                        "Module.resetCalculator()"
                    );
                },
            },
        ],
    },
    {
        role: "Help",
        submenu: [
            {
                label: "Manual",
                click: async () => {
                    const { shell } = require("electron");
                    await shell.openExternal(
                        "https://www.numworks.com/resources/manual/"
                    );
                },
            },
        ],
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.setAboutPanelOptions({
    applicationName: "NumWorks",
    applicationVersion: "18.2.2",
    copyright:
        "© 2022 NumWorks. All rights reserved. NumWorks is a registered trademark. Packaged by ShevonKwan",
});

function createWindow() {
    // Create the browser window.
    const WIDTH = 290;
    const HEIGHT = 555;
    const mainWindow = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        title: "Numworks",
        icon: "./numworks.ico",
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile("index.html");
    mainWindow.setAspectRatio(
        mainWindow.getSize()[0] / mainWindow.getSize()[1]
    );
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("init", init());
    });
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
