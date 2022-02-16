/**
 * 
 * Google Meet Desktop - Google Meet pero para escritorio.
 * @version 0.2
 * ´
 * Cambios en la actualización:
 * - Se removio el evento `click` del tray, ya que este escondia la ventana y no podias recuperarla.
 * - El menu contextual del tray fue cambiado por uno mas pequeño y sencillo.
 * - Se reconstruyo el código fuente, ya que este estaba MUY DESORDENADO.
 * 
 */

const electron = require("electron"); // Importar electron para poder crear la ventana principal.
const { app, BrowserWindow, Menu, Tray, shell } = require("electron"); // Importar todo lo necesario de electron para no tener que complicarme usando `electron.app...`
const fs = require("fs"); // Importar fs para leer el archivo de configuración en %APPDATA%\Google Meet
const yaml = require("js-yaml"); // Importar YAML para poder leer el contenido del archivo de configuración y la template.
const path = require("path"); // Path y ya we.

function GoogleMeetApp() // Función principal para cargar la ventana.
{

    let GoogleMeetCFPath = `${app.getPath("userData")}\\Configuration.yml`;
    let GoogleMeetConfFile = fs.readFileSync(GoogleMeetCFPath, "utf-8");

    let GoogleMeetConfig = yaml.load(GoogleMeetConfFile);

    let GoogleMeetWindow = new BrowserWindow({
        width: GoogleMeetConfig.WindowWidth || 1000,
        height: GoogleMeetConfig.WindowHeight || 600,
        icon: path.join(__dirname, "/icon.ico"),
        title: "Google Meet Desktop"
    });

}