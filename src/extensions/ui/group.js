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
            self.destroyStylesheets();
            self.setupStylesheets();
            self.toggleInviteNavFlash(e);
        });
        this.robot.extensions.PlayerStatus.emitInviteReceived();
    }

    disable() {
        this.destroyStylesheets();
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.GROUP_INVITE_RECEIVED, this.listeners.inviteNavFlash);
    }

    setupStylesheets() {
        let head = document.querySelector("head");
        let color = this.robot.getOption("group.invite_nav_flash_color", ERC.DEFAULT_SETTINGS.group.invite_nav_flash_color);
        this.stylesheets.inviteNavFlash = head.appendChild(document.createElement("style"));
        this.stylesheets.inviteNavFlash.className = "enragedrobot-groupui-stylesheet navFlash";
        this.stylesheets.inviteNavFlash.innerHTML = `
            .navbar4, .levelbar-medium-skills-container, .levelbar-small {
                animation: groupInviteAlert 4s infinite;
            }
            
            @keyframes groupInviteAlert {
                0%   { background-color: rgba(0,0,0,.3); }
                25%  { background-color: ${color}; }
                75%  { background-color: ${color}; }
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
        this.stylesheets.inviteNavFlash.disabled =
            event.data == null || (Array.isArray(event.data) && event.data.length === 0) || !this.robot.getOption("group.invite_nav_flash");
    }
}
