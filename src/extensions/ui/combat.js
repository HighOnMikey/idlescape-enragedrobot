class CombatUI {
    constructor(robot) {
        this.robot = robot;
        if (this.robot.getOption("extensions.CombatUI") === true) {
            this.enable();
        }
    }

    enable() {
        this.setupStylesheets();
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, this.toggleAvatarHandler);
    }

    disable() {
        this.destroyStylesheets();
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, this.toggleAvatarHandler);
    }

    setupStylesheets() {
        let head = document.querySelector("head");

        let playerAvatar = head.appendChild(document.createElement("style"));
        playerAvatar.className = "enragedrobot-combatui-stylesheet player-avatar";
        playerAvatar.innerHTML = `
            div.combat-player-area > div {
                position: relative !important;
            }
            
            div.combat-player-area > div > div.combat-fight-image-container {
                display: none !important;
            }
            
            div.combat-player-area > div > div.combat-info-bar {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
            }
        `;
        playerAvatar.disabled = !this.robot.getOption("ui.disable_player_avatar");

        let monsterAvatar = head.appendChild(document.createElement("style"));
        monsterAvatar.className = "enragedrobot-combatui-stylesheet monster-avatar";
        monsterAvatar.innerHTML = `
            div.combat-monster-area > div,
            .combat-monster-area {
                position: relative !important;
                margin-top: 0 !important;
            }
            
            div.combat-monster-area > div > div.combat-fight-image-container {
                display: none !important;
            }
            
            div.combat-monster-area > div > div.combat-info-bar {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
            }
        `;
        monsterAvatar.disabled = !this.robot.getOption("ui.disable_monster_avatar");
    }

    destroyStylesheets() {
        let stylesheets = document.querySelectorAll("style.enragedrobot-combatui-stylesheet");
        for (let sheet of stylesheets) {
            sheet.remove();
        }
    }

    toggleAvatarHandler(event) {
        let sheet = document.querySelector(`style.enragedrobot-combatui-stylesheet.${event.data}-avatar`);
        if (typeof sheet === "object") {
            sheet.disabled = !sheet.disabled;
        }
    }
}
