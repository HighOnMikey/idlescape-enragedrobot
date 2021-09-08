class PlayerStatus {
    constructor(robot) {
        this.robot = robot;
        this.equipmentEnchants = [];

        let socketInterval = setInterval(() => {
            if (typeof window.IdlescapeListener !== "undefined") {
                clearInterval(socketInterval);
                window.IdlescapeListener.messages.addEventListener("message", (e) => this.eventHandler(e));
            }
        }, 100);
    }

    eventHandler(e) {
        if (e.event === ERC.WS.EVENTS.UPDATE_PLAYER && e.data.hasOwnProperty("portion")) {
            if (Array.isArray(e.data.portion)) {
                if (e.data.portion.includes("activeEnchantments")) {
                    this.updateActiveEnchants(e.data.value);
                }
            }
        }
    }

    updateActiveEnchants(data) {
        if (!Array.isArray(data)) {
            return;
        }
        this.equipmentEnchants = [];
        data.forEach((e) => {
            if (!e.hasOwnProperty("enchantmentID")) return;
            let enchant = window.IdlescapeData.enchantments.get(e.enchantmentID);
            if (!enchant) return;
            enchant.equipmentStrength = e.hasOwnProperty("equipmentStrength") ? e.equipmentStrength : undefined;
            this.equipmentEnchants.push(enchant);
        });

        this.robot.uiEventHandler(ERC.UI_EVENTS.PLAYER_ENCHANT_UPDATE, this.equipmentEnchants);
    }
}
