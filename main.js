// Simple electron app
const { app, BrowserWindow, globalShortcut, clipboard, screen, ipcMain } = require('electron')
var ks = require('node-key-sender');
const path = require('path')
const url = require('url')


let win;

function createWindow() {
    win = new BrowserWindow({ width: 350, height: 400,
        x: 50, y: 50,
        autoHideMenuBar: true,
        maximizable: false,
        resizable: false,
        titleBarStyle: 'hidden',
        frame: false,
        animation: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
          },
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('close', event => {
        event.preventDefault();
        win.hide();
    });

    win.on("blur", event => {
        event.preventDefault();
        win.hide();
    });
    win.setSkipTaskbar(true);  // This is not working on Linux, app icon isn't hidden from taskbar
}



app.on('ready', () => {
    createWindow();
    
    globalShortcut.register('CommandOrCOntrol+Super+V', () => {
        // win.hide();
        // ks.sendCombination(['control', 'v']);
        
        // console.log(clipboard.availableFormats());
        // Make app visible
        var mouseDetails = screen.getCursorScreenPoint();
        win.setPosition(mouseDetails.x, mouseDetails.y);
        win.show();
    });
})

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg)
 
    // Event emitter for sending asynchronous messages
    event.sender.send('asynchronous-reply', 'async pong')
 })

 ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg)
 
    // Event emitter for sending asynchronous messages
    event.sender.send('synchronous-reply', 'sync pong')
 })



