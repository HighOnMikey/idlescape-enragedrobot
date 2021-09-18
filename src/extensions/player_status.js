class PlayerStatus {
    constructor(robot) {
        this.robot = robot;
        this.equipmentEnchants = [];
        this.groupInvites = [];
        this.destructiveEnchantEquipped = false;

        let socketInterval = setInterval(() => {
            if (typeof window.IdlescapeListener !== "undefined") {
                clearInterval(socketInterval);
                window.IdlescapeListener.messages.addEventListener("message", (e) => this.eventHandler(e));
            }
        }, 100);
    }

    eventHandler(e) {
        if (e.event !== ERC.WS.EVENTS.UPDATE_PLAYER || !e.data.hasOwnProperty("portion")) {
            return;
        }

        if (Array.isArray(e.data.portion) && e.data.portion.length > 0) {
            if (e.data.portion.includes("activeEnchantments")) {
                this.updateActiveEnchants(e.data.value);
            } else if (e.data.portion.includes("group")) {
                this.updateGroupStatus(e.data.value);
            } else if (e.data.portion.includes("knownInvites")) {
                this.updateGroupInvites(e.data.value);
            }
        } else if (e.data.portion === "all") {
            if (e.data.value.hasOwnProperty("activeEnchantments")) {
                this.updateActiveEnchants(e.data.value.activeEnchantments);
            }
        }
    }

    updateActiveEnchants(data) {
        if (!Array.isArray(data)) {
            return;
        }
        this.equipmentEnchants = [];
        let destructive = false;
        data.forEach((e) => {
            if (!e.hasOwnProperty("enchantmentID")) return;
            let enchant = window.IdlescapeData.enchantments.get(e.enchantmentID);
            if (!enchant) return;
            enchant.equipmentStrength = e.hasOwnProperty("equipmentStrength") ? e.equipmentStrength : undefined;
            if (enchant.destructive) {
                destructive = true;
            }
            this.equipmentEnchants.push(enchant);
        });

        this.destructiveEnchantEquipped = destructive;
        this.robot.uiEventHandler(ERC.UI_EVENTS.PLAYER_ENCHANT_UPDATE, this.equipmentEnchants);
        this.emitDestructiveEnchantStatus();
    }

    updateGroupInvites(data) {
        if (data === null) {
            data = [];
        }

        this.groupInvites = data;
        this.emitInviteReceived();
    }

    updateGroupStatus(data) {
        if (data === null) {
            return;
        }

        this.group = data;
    }

    emitInviteReceived() {
        this.robot.uiEventHandler(ERC.UI_EVENTS.GROUP_INVITE_RECEIVED, this.groupInvites);
    }

    emitDestructiveEnchantStatus() {
        this.robot.uiEventHandler(ERC.UI_EVENTS.DESTRUCTIVE_ENCHANT_STATUS, this.destructiveEnchantEquipped);
    }
}
