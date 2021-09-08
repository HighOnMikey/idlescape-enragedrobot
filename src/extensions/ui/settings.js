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
        this.waitForNavDrawer()
            .then((navDrawer) => this.getGameMenuItems(navDrawer))
            .then(() => this.addMenuItems())
            .then(() => this.watchNavDrawerClicks());
    }

    async waitForNavDrawer() {
        let self = this;

        return new Promise((resolve) => {
            let waitForNavbar = setInterval(() => {
                let t = document.querySelector("div.status-action");
                if (t === null) return;

                let navDrawer = document.querySelector("div.nav-drawer-container");
                if (navDrawer === null || !navDrawer.hasChildNodes()) return;

                navDrawer.childNodes.forEach((n) => {
                    if (n.innerText === "Logout") {
                        clearInterval(waitForNavbar);
                        resolve(navDrawer);
                    }
                });
            }, 50);
        });
    }

    getGameMenuItems(navDrawer) {
        this.GAME_MENU_ITEMS = [];
        navDrawer.childNodes.forEach((c) => {
            if (c.className === "drawer-item active noselect" && !this.STATE_IGNORED_MENU_ITEMS.includes(c.innerText)) {
                this.GAME_MENU_ITEMS.push(c);
            }
        });
    }

    addMenuItem(title, adjacentItem, callback = () => {}, position = "after", icon = false) {
        let navDrawer = document.querySelector("div.nav-drawer-container");
        if (navDrawer === null) throw "EnragedRobot.UI: couldn't find navigation drawer";

        let adjacentElement = false;
        navDrawer.childNodes.forEach((n) => {
            if (n.innerText === adjacentItem) adjacentElement = n;
        });

        if (!adjacentElement) throw `EnragedRobot.UI: couldn't find menu item ${adjacentItem}`;

        let newMenuItem = document.createElement("div");
        newMenuItem.className = "drawer-item active noselect enraged-robot-menu-item";
        newMenuItem.addEventListener("click", () => callback(this, title));
        let newMenuItemText = newMenuItem.appendChild(document.createElement("div"));
        newMenuItemText.className = "drawer-item-left";
        newMenuItemText.innerText = title;

        switch (position) {
            case "after":
                adjacentElement.insertAdjacentElement("afterend", newMenuItem);
                break;
            case "before":
                adjacentElement.insertAdjacentElement("beforebegin", newMenuItem);
                break;
            default:
                throw "EnragedRobot.UI: incorrect position given for new menu item";
        }

        this.STATE_IGNORED_MENU_ITEMS.push(title);
    }

    addMenuItems() {
        this.addMenuItem("Enraged Robot", "Settings", this.openSettings, "after");
    }

    watchNavDrawerClicks() {
        let self = this;

        let navDrawer = document.getElementsByClassName("nav-drawer-container")[0];
        navDrawer.addEventListener("click", function (e) {
            let target = e.target.classList.contains("drawer-item") ? e.target : e.target.closest("div.drawer-item.active.noselect");
            if (target === null) return;
            if (self.STATE_IGNORED_MENU_ITEMS.includes(target.innerText)) return;
            if (!self.GAME_MENU_ITEMS.includes(target)) {
                self.removeCustomPanel(false);
                return;
            }
            self.removeCustomPanel();
        });

        let headerContainer = document.querySelector("div.header-level-container");
        headerContainer.addEventListener("click", function (e) {
            let remove = false;
            if (e.target.classList.contains("skill-level-bar") || e.target.closest("div.skill-level-bar") !== null) {
                remove = true;
            }
            if ((e.target.classList.contains("exp-tooltip") && e.target.tagName === "TD") || e.target.closest("td.exp-tooltip") !== null) {
                remove = true;
            }

            if (remove) self.removeCustomPanel();
        });
    }

    openSettings(self, title) {
        self.clearPlayArea();
        let playAreaContainer = document.getElementsByClassName("play-area-container")[0];
        let navTab = playAreaContainer.getElementsByClassName("enraged-robot-tab")[0];

        navTab.firstChild.attributes.src.value = "/images/ui/options_gear.png";
        navTab.lastChild.data = title;

        let playArea = document.createElement("div");
        let panel = playArea.appendChild(document.createElement("div"));
        playArea.className = "play-area theme-smithing enraged-robot-panel";
        panel.className = "settings-panel enraged-robot-settings";

        let extensionsSection = self.createSection();
        extensionsSection.append(self.createSettingsHeader("Extensions"));
        extensionsSection.append(
            self.createSettingsCheckbox("Enable Combat UI", "extensions.CombatUI", false, (checked) =>
                self.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "CombatUI", enabled: checked }),
            ),
        );
        extensionsSection.append(
            self.createSettingsCheckbox("Enable Enchants UI", "extensions.EnchantsUI", false, (checked) =>
                self.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "EnchantsUI", enabled: checked }),
            ),
        );
        extensionsSection.append(
            self.createSettingsCheckbox("Enable Enhanced Tooltips", "extensions.Tooltips", false, (checked) =>
                self.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_EXTENSION, { extension: "Tooltips", enabled: checked }),
            ),
        );
        panel.append(extensionsSection);

        let combatUISection = self.createSection();
        combatUISection.append(self.createSettingsHeader("Combat UI"));
        combatUISection.append(
            self.createSettingsCheckbox(
                "Disable Player combat avatar and align info bar to top left",
                "combat.disable_player_avatar",
                false,
                () => {
                    self.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, "player");
                },
            ),
        );
        combatUISection.append(
            self.createSettingsCheckbox(
                "Disable monster combat avatar and align info bar to top right",
                "combat.disable_monster_avatar",
                false,
                () => {
                    self.robot.uiEventHandler(ERC.UI_EVENTS.TOGGLE_COMBAT_AVATAR, "monster");
                },
            ),
        );
        panel.append(combatUISection);

        let enchantsUISection = self.createSection();
        enchantsUISection.append(self.createSettingsHeader("Enchants UI"));
        enchantsUISection.append(
            self.createSettingsCheckbox(
                "Change the color of the top navigation bar when a destructive enchant is active (i.e. Scholar)",
                "enchants.destructive_warn",
                true,
                () => {
                    self.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
                },
            ),
        );
        enchantsUISection.append(
            self.createSettingsColorPicker(
                "Navigation bar color when destructive enchant is active",
                "enchants.destructive_color",
                ERC.DEFAULT_SETTINGS.enchants.destructive_color,
                () => {
                    self.robot.extensions.PlayerStatus.emitDestructiveEnchantStatus();
                },
            ),
        );
        panel.append(enchantsUISection);

        let tooltipsSection = self.createSection();
        tooltipsSection.append(self.createSettingsHeader("Tooltips"));
        tooltipsSection.append(self.createSettingsCheckbox("Use modifier to toggle enhanced tooltips", "tooltips.useModifierKey"));
        tooltipsSection.append(
            self.createSettingsKeybind("Modifier Key", "tooltips.modifierKey", ERC.DEFAULT_SETTINGS.tooltips.modifierKey),
        );
        tooltipsSection.append(
            self.createSettingsCheckbox(
                "Show market max value in tooltip (most of the time max value is useless)",
                "tooltips.showMarketMax",
                false,
            ),
        );
        panel.append(tooltipsSection);

        playAreaContainer.appendChild(playArea);
    }

    clearPlayArea() {
        let container = document.getElementsByClassName("play-area-container")[0];

        let playAreas = container.getElementsByClassName("play-area");
        for (let playArea of playAreas) {
            if (playArea.classList.contains("enraged-robot-panel")) {
                playArea.remove();
            } else {
                playArea.style.display = "none";
            }
        }

        let navTabs = container.getElementsByClassName("nav-tab-left");
        let gameTab;
        for (let navTab of navTabs) {
            if (navTab.classList.contains("enraged-robot-tab")) {
                navTab.remove();
            } else {
                gameTab = navTab;
                navTab.style.display = "none";
            }
        }
        let newTab = gameTab.cloneNode(true);
        newTab.style.display = "";
        newTab.classList.add("enraged-robot-tab");
        newTab.firstChild.attributes.src.value = "/images/loading_animation.svg";
        newTab.lastChild.data = "";
        gameTab.insertAdjacentElement("afterend", newTab);
    }

    removeCustomPanel(restorePlayArea = true) {
        let container = document.getElementsByClassName("play-area-container")[0];
        let playAreas = container.getElementsByClassName("play-area");
        for (let playArea of playAreas) {
            if (playArea.classList.contains("enraged-robot-panel")) {
                playArea.remove();
            } else if (restorePlayArea) {
                playArea.style.display = "";
            }
        }

        let navTabs = container.getElementsByClassName("nav-tab-left");
        for (let navTab of navTabs) {
            if (navTab.classList.contains("enraged-robot-tab")) {
                navTab.remove();
            } else if (restorePlayArea) {
                navTab.style.display = "";
            }
        }
    }

    createSection() {
        let section = document.createElement("div");
        section.style.marginBottom = "3em";

        return section;
    }

    createSettingsHeader(title) {
        let row = document.createElement("div");
        row.className = "settings-label";
        row.innerText = title;
        row.appendChild(document.createElement("hr"));

        return row;
    }

    createSettingsCheckbox(description, option, defaultValue = false, callback = () => {}) {
        let row = document.createElement("div");
        row.className = "settings-row";
        let label = row.appendChild(document.createElement("label"));
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.opacity = "1";
        checkbox.style.position = "static";
        checkbox.checked = this.robot.getOption(option, defaultValue);
        checkbox.onchange = (e) => {
            this.robot.setOption(option, e.target.checked);
            callback(e.target.checked);
        };
        label.append(checkbox);
        label.append(` ${description}`);

        return row;
    }
    createSettingsColorPicker(description, option, defaultValue = undefined, callback = () => {}) {
        let row = document.createElement("div");
        row.className = "settings-row";

        let picker = row.appendChild(document.createElement("input"));
        picker.type = "color";
        picker.value = this.robot.getOption(option, defaultValue);
        picker.className = "settings-button";
        picker.style.backgroundColor = "transparent";

        let save = row.appendChild(document.createElement("div"));
        save.className = "settings-button";
        save.style.textAlign = "center";
        save.onclick = () => {
            this.robot.setOption(option, picker.value);
            callback(picker.value);
        };
        save.append("Save");

        let reset = row.appendChild(document.createElement("div"));
        reset.className = "settings-button";
        reset.style.backgroundColor = "#8B0000";
        reset.style.textAlign = "center";
        reset.onclick = () => {
            picker.value = this.robot.getOption(option, defaultValue);
            callback(picker.value);
        };
        reset.append("Reset");

        let defaultButton = row.appendChild(document.createElement("div"));
        defaultButton.className = "settings-button";
        defaultButton.style.backgroundColor = "#8B0000";
        defaultButton.style.textAlign = "center";
        defaultButton.onclick = () => {
            picker.value = defaultValue;
            callback(picker.value);
        };
        defaultButton.append("Default");

        let label = row.appendChild(document.createElement("label"));
        label.style.height = "28px";
        label.style.lineHeight = "28px";
        label.style.marginLeft = "10px";
        label.style.marginBottom = "0px";
        label.style.marginTop = "3px";
        label.append(`${description}`);

        return row;
    }
    createSettingsKeybind(description, option, defaultValue = undefined) {
        let row = document.createElement("div");
        row.className = "settings-row";
        let textBox = row.appendChild(document.createElement("input"));
        textBox.type = "text";
        textBox.readOnly = true;
        textBox.className = "settings-textbox";
        textBox.style.width = "140px";
        textBox.value = `${description}: ${this.robot.getOption(option, defaultValue)}`;
        textBox.data = this.robot.getOption(option, defaultValue);
        textBox.onkeydown = (e) => {
            textBox.value = `${description}: ${e.key}`;
            textBox.data = e.key;
        };
        let save = row.appendChild(document.createElement("div"));
        save.className = "settings-button";
        save.style.textAlign = "center";
        save.onclick = () => this.robot.setOption(option, textBox.data);
        save.append("Save");

        let reset = row.appendChild(document.createElement("div"));
        reset.className = "settings-button";
        reset.style.backgroundColor = "#8B0000";
        reset.style.textAlign = "center";
        reset.onclick = () => {
            let modKey = this.robot.getOption(option, defaultValue);
            textBox.value = `${description}: ${modKey}`;
            textBox.data = modKey;
        };
        reset.append("Reset");

        let defaultButton = row.appendChild(document.createElement("div"));
        defaultButton.className = "settings-button";
        defaultButton.style.backgroundColor = "#8B0000";
        defaultButton.style.textAlign = "center";
        defaultButton.onclick = () => {
            textBox.value = `${description}: ${defaultValue}`;
            textBox.data = defaultValue;
            this.robot.setOption(option, defaultValue);
        };
        defaultButton.append("Default");

        return row;
    }
}
