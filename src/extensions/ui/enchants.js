class EnchantsUI {
    constructor(robot) {
        this.robot = robot;
        if (this.robot.getOption("extensions.EnchantsUI") === true) {
            this.enable();
        }
    }

    enable() {
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.PLAYER_ENCHANT_UPDATE, this.updateEnchantments);
    }

    disable() {
        this.robot.uiEvents.addEventListener(ERC.UI_EVENTS.PLAYER_ENCHANT_UPDATE, this.updateEnchantments);
    }

    updateEnchantments(event) {
        let data;
        if (typeof event.data !== "object") return;
        data = event.data;

        if (!this.robot.getOption("enchants.destructive_warn")) return;

        let destructive = false;
        let scholar = IdlescapeData.enchantments.getByName("Scholar");
        let wealth = IdlescapeData.enchantments.getByName("Wealth");
        data.forEach((enchant) => {
            if (enchant.id === scholar.id || enchant.id === wealth.id) {
                destructive = true;
            }
        });

        let navbar = document.querySelector("div.navbar1");
        navbar.style.backgroundColor = destructive ? this.robot.getOption("enchants.destructive_color") : undefined;
    }
}
