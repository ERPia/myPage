cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.gnustory.kakaolink/www/js/KakaoLinkPlugin.js",
        "id": "com.gnustory.kakaolink.KakaoLinkPlugin",
<<<<<<< HEAD
=======
        "pluginId": "com.gnustory.kakaolink",
>>>>>>> refs/remotes/origin/master
        "clobbers": [
            "KakaoLinkPlugin"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "pluginId": "com.phonegap.plugins.PushPlugin",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "id": "cordova-plugin-x-toast.Toast",
<<<<<<< HEAD
        "clobbers": [
            "window.plugins.toast"
=======
        "pluginId": "cordova-plugin-x-toast",
        "clobbers": [
            "device"
>>>>>>> refs/remotes/origin/master
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/test/tests.js",
<<<<<<< HEAD
        "id": "cordova-plugin-x-toast.tests"
=======
        "id": "cordova-plugin-x-toast.tests",
        "pluginId": "cordova-plugin-x-toast"
>>>>>>> refs/remotes/origin/master
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.printer/www/printer.js",
        "id": "de.appplant.cordova.plugin.printer.Printer",
        "pluginId": "de.appplant.cordova.plugin.printer",
        "clobbers": [
            "plugin.printer",
            "cordova.plugins.printer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
<<<<<<< HEAD
=======
        "pluginId": "org.apache.cordova.device",
>>>>>>> refs/remotes/origin/master
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
<<<<<<< HEAD
=======
        "pluginId": "org.apache.cordova.vibration",
>>>>>>> refs/remotes/origin/master
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
<<<<<<< HEAD
=======
        "pluginId": "cordova-plugin-inappbrowser",
>>>>>>> refs/remotes/origin/master
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.gnustory.kakaolink": "0.0.1",
    "com.phonegap.plugins.PushPlugin": "2.5.0",
    "cordova-plugin-whitelist": "1.1.1-dev",
    "cordova-plugin-x-toast": "2.2.1",
    "de.appplant.cordova.plugin.printer": "0.7.1",
    "org.apache.cordova.device": "0.3.0",
    "org.apache.cordova.vibration": "0.3.13",
    "cordova-plugin-inappbrowser": "1.1.1"
}
// BOTTOM OF METADATA
});