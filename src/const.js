class ERC {
    static STORAGE_KEY = "enragedRobot";
    static STORAGE_VERSION = 1;
    static DEFAULT_SETTINGS = {
        enchantments: {
            destructive_warn: true,
        },
        extensions: {
            Tooltips: true,
            CombatUI: true,
        },
        ui: {
            disable_monster_avatar: false,
            disable_player_avatar: false,
        },
        tooltips: {
            useModifierKey: false,
            modifierKey: "Control",
        },
        storage_version: this.STORAGE_VERSION,
    };

    static UI_EVENTS = {
        PLAYER_ENCHANTMENT_UPDATE: 1000,
        TOGGLE_COMBAT_AVATAR: "toggle combat avatar",
        TOGGLE_EXTENSION: "toggle extension",
    };
}
