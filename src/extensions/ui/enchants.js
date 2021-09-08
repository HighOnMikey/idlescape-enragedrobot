class EnchantsUI {
    constructor(robot) {
        this.robot = robot;
        if (this.robot.getOption("extensions.EnchantsUI") === true) {
            this.enable();
        }
    }

    enable() {
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.DESTRUCTIVE_ENCHANT_STATUS, this.toggleDestructiveWarning);
        this.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
    }

    disable() {
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.DESTRUCTIVE_ENCHANT_STATUS, this.toggleDestructiveWarning);
        let navbar = document.querySelector("div.navbar1");
        if (!navbar) return;
        navbar.style.background = "";
    }

    toggleDestructiveWarning(event) {
        let navbar = document.querySelector("div.navbar1");
        if (!navbar) return;
        let enabled = window.enragedRobot.getOption("enchants.destructive_warn");
        let color = window.enragedRobot.getOption("enchants.destructive_color");
        navbar.style.background = event.data ? (enabled ? color : "") : "";
    }
}
