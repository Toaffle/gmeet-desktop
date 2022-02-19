/**
 * Empaquetara la aplicación y la borrara para hacer un asar.
 */

const Packager = require("electron-packager");
const asar = require("asar");

const options = {
    "arch": "x86_64", // Arquitectura del ejecutable.
    "platform": "win32", // Plataforma.
    "dir": "./",
    "app-copyright": "Toaffle 32",
    "app-version": "0.2.0",
    "asar": true,
    "icon": "icon.ico",
    "name": "Google Meet - Desktop",
    "ignore": ["./.git", "./releases"],
    "out": "./releases",
    "overwrite": true,
    "prune": true,
    "executableName": "meet"
};

Packager(options, function done(err, ap) {
    console.log(err);
    console.log(ap);
});