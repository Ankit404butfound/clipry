// Simple electron app
const { app, BrowserWindow, globalShortcut, clipboard, screen, ipcMain, nativeImage } = require('electron')
const ks = require('node-key-sender');
const path = require('path')
const url = require('url')
// const sqlite = require('sqlite3')


let win;
let maxID = 0;
let lastClipData = "";
let clipContents = Object();


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
            devTools: true
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
    
    globalShortcut.register('CommandOrControl+Super+Shift+V', () => {
        // win.hide();
        // ks.sendCombination(['control', 'v']);
        
        // console.log(clipboard.availableFormats());
        // Make app 315371
        var mouseDetails = screen.getCursorScreenPoint();
        win.setPosition(mouseDetails.x, mouseDetails.y);
        win.show();
    });

    globalShortcut.register('CommandOrControl+Super+Shift+X', () => {
        // Kill app
        app.quit();
        process.exit(0);
    });
})

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg)
 
    // Event emitter for sending asynchronous messages
    event.sender.send('asynchronous-reply', 'async pong')
 })

 ipcMain.on("paste", (event, isVisible, type=null, data=null) => {
    if (isVisible == 1){
        win.show();
    }
    else{
        win.hide();
        if (type == "text"){
            clipboard.writeText(data);
        }
        else if (type == "image"){
            clipboard.writeImage(nativeImage.createFromDataURL(data));
        }
        
        ks.sendCombination(['control', 'v']);
    }
 });


 ipcMain.on("removeClip", (event, id) => {
    delete clipContents[id];
 });


 setInterval(() => {
    // console.log(clipboard.readText());
    // var data = clipboard.readImage().toDataURL();
    // console.log("imgdata", data.length);
    // clipboard.clear();
    // clipboard.writeImage(nativeImage.createFromDataURL(data));
    // console.log(clipboard.has("image/p;ng"));
    if (clipboard.has("image/png") && lastClipData != clipboard.readImage().toDataURL()){
        maxID += 1;
        win.webContents.send('addClip', "image", clipboard.readImage().toDataURL(), maxID);
        lastClipData = clipboard.readImage().toDataURL();
    }
    else if (clipboard.has("text/plain")){
        var key = Object.keys(clipContents).find(function(k) { if (clipContents[k] == clipboard.readText()) return k; });
        if (key == undefined){
            maxID += 1;
            clipContents[maxID] = clipboard.readText();
            win.webContents.send('addClip', "text", clipboard.readText(), maxID);
        }
        else{
            win.webContents.send('setSelected', key);
        }
    }
    else{
        console.log("No data");
    }
    
 }, 1000);

