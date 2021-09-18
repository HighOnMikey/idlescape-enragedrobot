// ==UserScript==
// @name            EnragedRobot Loader
// @namespace       EnragedRobot
// @version         0.7.11
// @description     Loads scripts written by Schlermbo/HighOnMikey
// @author          Schlermbo/HighOnMikey
// @match           *://*.idlescape.com/*
// @updateURL       https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/enragedrobot.user.js
// @downloadURL     https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/enragedrobot.user.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-socketio-listener/main/src/idlescape-listener.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-data/main/src/data.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/const.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/enragedrobot.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/player_status.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/ui/settings.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/ui/tooltips.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/ui/combat.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/ui/group.js
// @require         https://raw.githubusercontent.com/HighOnMikey/idlescape-enragedrobot/main/src/extensions/ui/enchants.js
// @grant           none
// @run-at          document-start
// ==/UserScript==

IdlescapeSocketListener.attach();
IdlescapeDatabase.createDefault();
(function () {
    window.enragedRobot = new EnragedRobot();
    window.addEventListener("load", function _() {
        window.enragedRobot.loadExtensions();
        window.removeEventListener("load", _);
    });
})();
