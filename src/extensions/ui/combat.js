class CombatUI {
    constructor(robot) {
        this.robot = robot;
        this.stylesheets = {};
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

        this.stylesheets.playerAvatar = head.appendChild(document.createElement("style"));
        this.stylesheets.playerAvatar.className = "enragedrobot-combatui-stylesheet player-avatar";
        this.stylesheets.playerAvatar.innerHTML = `
            div.combat-player-area > div {
                right: unset !important;
                left: 0 !important;
                top: 32px !important;
                bottom: unset !important;
                margin-top: 0 !important;
            }
            
            div.combat-player-area > div > div.combat-fight-image-container img {
                display: none !important;
            }
            
            div.combat-player-area > div > div.combat-info-bar {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
            }
        `;
        this.stylesheets.playerAvatar.disabled = !this.robot.getOption("combat.disable_player_avatar");

        this.stylesheets.monsterAvatar = head.appendChild(document.createElement("style"));
        this.stylesheets.monsterAvatar.className = "enragedrobot-combatui-stylesheet monster-avatar";
        this.stylesheets.monsterAvatar.innerHTML = `
            div.combat-monster-area > div {
                left: unset !important;
                right: 0 !important;
                top: 32px !important;
                bottom: unset !important;
                margin-top: 0 !important;
            }
            
            div.combat-monster-area > div > div.combat-fight-image-container img {
                display: none !important;
            }
            
            div.combat-monster-area > div > div.combat-info-bar {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
            }
        `;
        this.stylesheets.monsterAvatar.disabled = !this.robot.getOption("combat.disable_monster_avatar");
    }

    destroyStylesheets() {
        Object.values(this.stylesheets).forEach((stylesheet) => {
            stylesheet.remove();
        });
    }

    toggleAvatarHandler(event) {
        let sheet = `${event.data}Avatar`;
        if (!this.stylesheets.hasOwnProperty(sheet)) return;
        this.stylesheets[sheet].disabled = !this.stylesheets[sheet].disabled;
    }
}
