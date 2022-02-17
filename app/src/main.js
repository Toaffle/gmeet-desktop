/**
 * 
 * Google Meet Desktop - Google Meet pero para escritorio.
 * @version 0.2
 * ´
 * Cambios en la actualización:
 * - Se removio el evento `click` del tray, ya que este escondia la ventana y no podias recuperarla.
 * - El menu contextual del tray fue cambiado por uno mas pequeño y sencillo.
 * - Se reconstruyo el código fuente, ya que este estaba MUY DESORDENADO.
 * - Se añadió un archivo de configuración.
 * 
 */

const electron = require("electron"); // Importar electron para poder crear la ventana principal.
const { app, BrowserWindow, Menu, Tray, shell } = require("electron"); // Importar todo lo necesario de electron para no tener que complicarme usando `electron.app...`
const fs = require("fs"); // Importar fs para leer el archivo de configuración en %APPDATA%\Google Meet
const yaml = require("js-yaml"); // Importar YAML para poder leer el contenido del archivo de configuración y la template.
const path = require("path"); // Path y ya we.

let GoogleMeetTray = null; // Definido antes, porque hay un problema que causa que el tray desaparezca despues de determinado tiempo.

function GoogleMeetApp() // Función principal para cargar la ventana.
{
    var devEnvEnabled = false; // Variable devEnvEnabled(si el modo de desarrollador esta activado)

    function enableOutputLogging() // Activa el modo de desarrollador
    {
        devEnvEnabled = true;
        console.log("--- Google Meet [DevEnv] ---");
        console.log("Event logging is enabled.");
        process.stdout.write("Launching application...");
    }

    let devEnv = {
        report(report_content, report_type)
        {
            if (devEnvEnabled == true)
            {
                if (report_type == 1)
                {
                    process.stdout.write(report_content);
                }
                else if (report_type == 0 || !report_type)
                {
                    console.log(report_content);
                }
            }
        }
    };

    app.setPath("userData",`${app.getPath("appData")}\\Google Meet`); // Cambiar la ubicación de los datos.

    let GoogleMeetCFPath = `${app.getPath("userData")}\\Configuration.yml`;


    if (!fs.existsSync(GoogleMeetCFPath))
    {
        fs.writeFileSync(GoogleMeetCFPath, `# Este archivo contiene la configuración de Google Meet Desktoo.
# Si necesitas ayuda para modificarlo, puedes
# encontrar ayuda aquí: https://toaffle.github.io/GoogleMeet/docs/Config_File.html

WindowWidth: 1000
WindowHeight: 600
AutoHideMenuBar: true
ShowBeforeLoad: false`);
        devEnv.report("(OK) Archivo de configuración creado.");
    }
    else
    {
        devEnv.report("(WARN) El archivo de configuración ya existe.")
    }

    
    let GoogleMeetConfFile = fs.readFileSync(GoogleMeetCFPath, "utf-8");

    let GoogleMeetConfig = yaml.load(GoogleMeetConfFile);

    let GoogleMeetWindow = new BrowserWindow({
        width: GoogleMeetConfig.WindowWidth || 1000, // Ancho de la ventana.
        height: GoogleMeetConfig.WindowHeight || 600, // Alto de la ventana.
        icon: "icon.ico", // Icono de la aplicación.
        title: "Google Meet Desktop", // Titulo de la Aplicación
        autoHideMenuBar: GoogleMeetConfig.AutoHideMenuBar || true, // Esconder la barra de menu.
        minHeight: 400, // Alto minimo
        minWidth: 600, // Ancho minimo
        x: 200, // Posicion x
        y: 50, // Posicion y
        show: false // Esconder la ventana.
    });

    GoogleMeetWindow.loadURL("https://meet.google.com/");

    // Comprobar si la ventana se debe mostrar antes de que termine de cargar o no.
    if (GoogleMeetConfig.ShowBeforeLoad == true)
    {
        GoogleMeetWindow.show();

    }
    else
    {
        GoogleMeetWindow.on("ready-to-show", function()
        {
            GoogleMeetWindow.show();
        });
    }

    GoogleMeetTray = new Tray("icon.ico");

    let TrayContextMenuTemplate = [
        {
            label: "Mostrar/Esconder",
            accelerator: "CmdOrCtrl+H",
            click: () => {
                if (GoogleMeetWindow.isVisible() == true)
                    GoogleMeetWindow.hide();
                else
                    GoogleMeetWindow.show();
            }
        },
        {
            label: "Cerrar",
            accelerator: "CmdOrCtrl+Q",
            click: app.quit
        }
    ];

    let AppContextMenuTemplate = [
        {
            label: "Application",
            submenu: [
                {
                    label: "Mostrar o Esconder",
                    accelerator: "CmdOrCtrl+H",
                    click: () => {
                        if (GoogleMeetWindow.isVisible() == true)
                            GoogleMeetWindow.hide();
                        else
                            GoogleMeetWindow.show();
                    }
                },
                {
                    label: "Cerrar",
                    accelerator: "CmdOrCtrl+Q",
                    click: app.quit
                }
            ]
        }
    ];

    GoogleMeetWindow.setMenu(Menu.buildFromTemplate(AppContextMenuTemplate));

    GoogleMeetTray.setContextMenu(Menu.buildFromTemplate(TrayContextMenuTemplate));
    GoogleMeetTray.setTitle("Google Meet Desktop");

    

    

    if (process.env.NODE_ENV == "development")
    {
        enableOutputLogging();
        GoogleMeetWindow.webContents.openDevTools({
            mode: "detach"
        });
    }

};

app.setUserTasks([
    {
      program: process.execPath,
      arguments: 'new',
      iconPath: process.execPath,
      iconIndex: 0,
      title: 'Nueva reunión.',
      description: 'Crear una nueva reunión.'
    },
    {
        program: process.execPath,
        arguments: 'join',
        iconPath: process.execPath,
        iconIndex: 0,
        title: "Unirse",
        description: 'Unirse a una reunión."'
      }
]);

app.whenReady().then(() => {
    GoogleMeetApp();
    console.log(" Done.");
});

