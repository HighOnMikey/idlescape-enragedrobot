class GroupUI {
    constructor(robot) {
        this.robot = robot;
        this.stylesheets = {};
        this.listeners = {};
        if (this.robot.getOption("extensions.GroupUI") === true) {
            this.enable();
        }
    }

    enable() {
        let self = this;
        this.setupStylesheets();
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.GROUP_INVITE_RECEIVED, function l(e) {
            self.listeners.inviteNavFlash = l;
            self.toggleInviteNavFlash(e);
        });
        this.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
    }

    disable() {
        this.destroyStylesheets();
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.GROUP_INVITE_RECEIVED, this.listeners.inviteNavFlash);
    }

    setupStylesheets() {
        let head = document.querySelector("head");
        this.stylesheets.inviteNavFlash = head.appendChild(document.createElement("style"));
        this.stylesheets.inviteNavFlash.className = "enragedrobot-groupui-stylesheet navFlash";
        this.stylesheets.inviteNavFlash.innerHTML = `
            .navbar4 {
                animation: groupInviteAlert 4s infinite;
            }
            
            @keyframes groupInviteAlert {
                0%   { background-color: rgba(0,0,0,.3); }
                25%  { background-color: rgba(200, 200, 0, .50); }
                75%  { background-color: rgba(200, 200, 0, .50); }
                100% { background-color: rgba(0,0,0,.3); }
            }
        `;

        this.stylesheets.inviteNavFlash.disabled = true;
    }

    destroyStylesheets() {
        for (let k in this.stylesheets) {
            this.stylesheets[k].remove();
            delete this.stylesheets[k];
        }
    }

    toggleInviteNavFlash(event) {
        this.stylesheets.inviteNavFlash.disabled = event.data == null || (Array.isArray(event.data) && event.data.length === 0);
    }
}
