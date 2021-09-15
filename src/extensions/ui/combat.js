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
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, (e) => this.toggleAvatarHandler(e));
    }

    disable() {
        this.destroyStylesheets();
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, (e) => this.toggleAvatarHandler(e));
    }

    setupStylesheets() {
        let head = document.querySelector("head");

        let playerAvatarDisabled = this.robot.getOption("combat.disable_player_avatar");
        let monsterAvatarDisabled = this.robot.getOption("combat.disable_monster_avatar");

        this.stylesheets.shared = head.appendChild(document.createElement("style"));
        this.stylesheets.shared.className = "enragedrobot-combatui-stylesheet shared";
        this.stylesheets.shared.innerHTML = `
            .combat-fight {
                grid-template-columns: repeat(2, 1fr) !important;
                padding-top: 32px !important;
            }
        `;
        this.stylesheets.shared.disabled = !(playerAvatarDisabled || monsterAvatarDisabled);

        this.stylesheets.playerAvatar = head.appendChild(document.createElement("style"));
        this.stylesheets.playerAvatar.className = "enragedrobot-combatui-stylesheet player-avatar";
        this.stylesheets.playerAvatar.innerHTML = `
            .combat-player-area > div {
                bottom: unset !important;
                top: 0 !important;
                margin: 0 !important;
                grid-template-columns: repeat(1, 1fr) !important;
                grid-template-rows: repeat(1, 1fr) !important;
            }
            
            .combat-player-area .combat-fight-image-container > img,
            .combat-player-area .combat-fight-image-container > div > img {
                display: none !important;
            }
            
            .combat-player-area .combat-info-bar,
            .combat-player-area .combat-fight-image-container {
                grid-area: 1 / 1 / 1 /1 !important;
            }
            
            .combat-player-area .combat-fight-image-container {
                z-index: 1024 !important;
            }
        `;
        this.stylesheets.playerAvatar.disabled = !playerAvatarDisabled;

        this.stylesheets.monsterAvatar = head.appendChild(document.createElement("style"));
        this.stylesheets.monsterAvatar.className = "enragedrobot-combatui-stylesheet monster-avatar";
        this.stylesheets.monsterAvatar.innerHTML = `
            .combat-monster-area > div {
                bottom: unset !important;
                top: 0 !important;
                margin: 0 !important;
                grid-template-columns: repeat(1, 1fr) !important;
                grid-template-rows: repeat(1, 1fr) !important;
            }
            
            .combat-monster-area .combat-fight-image-container > img,
            .combat-monster-area .combat-fight-image-container > div > img {
                display: none !important;
            }
            
            .combat-monster-area .combat-info-bar,
            .combat-monster-area .combat-fight-image-container {
                grid-area: 1 / 1 / 1 /1 !important;
            }
            
            .combat-monster-area .combat-fight-image-container {
                z-index: 1024 !important;
            }
        `;
        this.stylesheets.monsterAvatar.disabled = !monsterAvatarDisabled;
    }

    destroyStylesheets() {
        for (let k in this.stylesheets) {
            this.stylesheets[k].remove();
            delete this.stylesheets[k];
        }
    }

    toggleAvatarHandler(event) {
        let sheet = `${event.data}Avatar`;
        if (!this.stylesheets.hasOwnProperty(sheet)) return;
        this.stylesheets[sheet].disabled = !this.robot.getOption(`combat.disable_${event.data}_avatar`);

        let playerAvatarDisabled = this.robot.getOption("combat.disable_player_avatar");
        let monsterAvatarDisabled = this.robot.getOption("combat.disable_monster_avatar");
        this.stylesheets.shared.disabled = !(playerAvatarDisabled || monsterAvatarDisabled);
    }
}
