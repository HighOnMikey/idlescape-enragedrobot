class Settings {
    GAME_MENU_ITEMS = [];
    STATE_IGNORED_MENU_ITEMS = [
        "Loot Log",
        "Wiki",
        "Rules",
        "Reddit",
        "Discord",
        "Forum",
        "Change Character",
        "Send Feedback",
        "Donate",
        "Logout",
    ];

    constructor(robot) {
        this.robot = robot;
        CustomPanelManager.attach().then(() => {
            this.addMenuItems();
        });
    }

    addMenuItems() {
        window.PanelManager.addMenuItem(
            "Enraged Robot",
            "Settings",
            this.openSettings.bind(this),
            "after",
            "images/fishing/Advanced_Tacklebox.png",
        );
    }

    openSettings(title, icon) {
        window.PanelManager.clearPlayArea();
        let playArea = window.PanelManager.createPlayArea(title, icon);
        let panel = playArea.appendChild(CustomPanelSettingsUI.createSettingsPanel());

        let extensionsSection = CustomPanelSettingsUI.createSection();
        extensionsSection.append(CustomPanelSettingsUI.createSettingsHeader("Extensions"));
        extensionsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Enable Combat UI",
                this.robot.getOption("extensions.CombatUI", false),
                (checked) => {
                    this.robot.setOption("extensions.CombatUI", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "CombatUI", enabled: checked });
                },
            ),
        );
        extensionsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Enable Group UI",
                this.robot.getOption("extensions.GroupUI", false),
                (checked) => {
                    this.robot.setOption("extensions.GroupUI", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "GroupUI", enabled: checked });
                },
            ),
        );
        extensionsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Enable Enchants UI",
                this.robot.getOption("extensions.EnchantsUI", false),
                (checked) => {
                    this.robot.setOption("extensions.EnchantsUI", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "EnchantsUI", enabled: checked });
                },
            ),
        );
        extensionsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Enable Enhanced Tooltips",
                this.robot.getOption("extensions.Tooltips", false),
                (checked) => {
                    this.robot.setOption("extensions.Tooltips", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "Tooltips", enabled: checked });
                },
            ),
        );
        panel.append(extensionsSection);

        let combatUISection = CustomPanelSettingsUI.createSection();
        combatUISection.append(CustomPanelSettingsUI.createSettingsHeader("Combat UI"));
        combatUISection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Disable Player combat avatar and align info bar to top left",
                this.robot.getOption("combat.disable_player_avatar", false),
                (checked) => {
                    this.robot.setOption("combat.disable_player_avatar", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, "player");
                },
            ),
        );
        combatUISection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Disable monster combat avatar and align info bar to top right",
                this.robot.getOption("combat.disable_monster_avatar", false),
                (checked) => {
                    this.robot.setOption("combat.disable_monster_avatar", checked);
                    this.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, "monster");
                },
            ),
        );
        panel.append(combatUISection);

        let groupUISection = CustomPanelSettingsUI.createSection();
        groupUISection.append(CustomPanelSettingsUI.createSettingsHeader("Group UI"));
        groupUISection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Flash combat navigation bar when a group invite is pending",
                this.robot.getOption("group.invite_nav_flash", false),
                (checked) => {
                    this.robot.setOption("group.invite_nav_flash", checked);
                    this.robot.extensions.PlayerStatus.emitInviteReceived();
                },
            ),
        );
        groupUISection.append(
            CustomPanelSettingsUI.createSettingsColorPicker(
                "Combat navigation bar flash color when a group invite is pending",
                this.robot.getOption("group.invite_nav_flash_color", ERC.DEFAULT_SETTINGS.group.invite_nav_flash_color),
                ERC.DEFAULT_SETTINGS.group.invite_nav_flash_color,
                (color) => {
                    this.robot.setOption("group.invite_nav_flash_color", color);
                    this.robot.extensions.PlayerStatus.emitInviteReceived();
                },
            ),
        );
        panel.append(groupUISection);

        let enchantsUISection = CustomPanelSettingsUI.createSection();
        enchantsUISection.append(CustomPanelSettingsUI.createSettingsHeader("Enchants UI"));
        enchantsUISection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Change the color of the top navigation bar when a destructive enchant is active (i.e. Scholar)",
                this.robot.getOption("enchants.destructive_warn", false),
                (checked) => {
                    this.robot.setOption("enchants.destructive_warn", checked);
                    this.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
                },
            ),
        );
        enchantsUISection.append(
            CustomPanelSettingsUI.createSettingsColorPicker(
                "Top navigation bar color when destructive enchant is active",
                this.robot.getOption("enchants.destructive_color", ERC.DEFAULT_SETTINGS.enchants.destructive_color),
                ERC.DEFAULT_SETTINGS.enchants.destructive_color,
                (color) => {
                    this.robot.setOption("enchants.destructive_color", color);
                    this.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
                },
            ),
        );
        panel.append(enchantsUISection);

        let tooltipsSection = CustomPanelSettingsUI.createSection();
        tooltipsSection.append(CustomPanelSettingsUI.createSettingsHeader("Tooltips"));
        tooltipsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Use modifier to toggle enhanced tooltips",
                this.robot.getOption("tooltips.useModifierKey", false),
                (checked) => {
                    this.robot.setOption("tooltips.useModifierKey", checked);
                },
            ),
        );
        tooltipsSection.append(
            CustomPanelSettingsUI.createSettingsKeybind(
                "Modifier Key",
                this.robot.getOption("tooltips.modifierKey", ERC.DEFAULT_SETTINGS.tooltips.modifierKey),
                ERC.DEFAULT_SETTINGS.tooltips.modifierKey,
                (key) => {
                    this.robot.setOption("tooltips.modifierKey", key);
                },
            ),
        );
        tooltipsSection.append(
            CustomPanelSettingsUI.createSettingsCheckbox(
                "Show market max value in tooltip (most of the time max value is useless)",
                this.robot.getOption("tooltips.showMarketMax", false),
                (checked) => {
                    this.robot.setOption("tooltips.showMarketMax", checked);
                },
            ),
        );
        panel.append(tooltipsSection);
    }
}
