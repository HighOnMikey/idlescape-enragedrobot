class ERC {
    static STORAGE_KEY = "enragedRobot";
    static STORAGE_VERSION = 4;
    static DEFAULT_SETTINGS = {
        combat: {
            disable_monster_avatar: false,
            disable_player_avatar: false,
        },
        group: {
            invite_nav_flash: true,
            invite_nav_flash_color: "#a0a000",
            show_group_tooltips: true,
        },
        enchants: {
            destructive_warn: true,
            destructive_color: "#8B0000",
        },
        extensions: {
            Tooltips: true,
            CombatUI: true,
            GroupUI: true,
            EnchantsUI: true,
        },
        tooltips: {
            useModifierKey: false,
            modifierKey: "Control",
        },
        storage_version: ERC.STORAGE_VERSION,
    };

    static UI_EVENTS = {
        PLAYER_ENCHANT_UPDATE: "player enchant update",
        DESTRUCTIVE_ENCHANT_STATUS: "destructive enchant status",
        GROUP_INVITE_RECEIVED: "group invite received",
        TOGGLE_COMBAT_AVATAR: "toggle combat avatar",
        TOGGLE_EXTENSION: "toggle extension",
    };

    static WS = {
        EVENTS: {
            AUGMENT_CHANT: "augmenting success chance",
            AUGMENT_ITEM: "augment item",
            AUGMENT_RESULT: "augment response",
            CHAT_HISTORY: "chat history",
            CHAT_RECEIVE: "send message",
            COMBAT_CLEAR: "clear monster",
            COMBAT_HIT: "combat hit",
            COMBAT_KILL: "lootlog kill",
            COMBAT_LOOT: "lootlog log",
            COMBAT_START: "new monster",
            CRAFT_ITEM: "craft item",
            COOKING_COMPLETE: "cooking complete",
            COOKING_INFO: "cooking information",
            EXPERIENCE_GAIN: "experience popup",
            MARKETPLACE_BUY_ITEM: "buy item marketplace",
            MARKETPLACE_GET_AUCTIONS: "get player marketplace items",
            START_ACTION: "start action",
            STOP_ACTION: "stop action",
            UPDATE_INVENTORY: "update inventory",
            UPDATE_PLAYER: "update player",
        },
    };
}
