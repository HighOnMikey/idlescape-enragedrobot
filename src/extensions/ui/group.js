class GroupUI {
    constructor(robot) {
        this.robot = robot;
        this.stylesheets = {};
        this.listeners = {};
        this.observers = {};
        this.tooltips = [];
        if (this.robot.getOption("extensions.GroupUI") === true) {
            this.enable();
        }
    }

    enable() {
        let self = this;
        let domWaitInterval = setInterval(() => {
            if (document.querySelector(".play-area-container") === null) return;
            this.setupObservers();
            this.startObservers();
            clearInterval(domWaitInterval);
        }, 250);
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
        this.destroyObservers();
        this.robot.uiEvents.removeEventListener(ERC.UI_EVENTS.GROUP_INVITE_RECEIVED, this.listeners.inviteNavFlash);
    }

    setupGroupTooltips() {
        let self = this;
        let ignored = Array("combat-group-info-player", "combat-group-info-player-targeted-player");
        let elems = document.querySelectorAll(".combat-group-info-player");
        elems.forEach((e) => {
            let name = "";
            e.classList.forEach((c) => {
                if (ignored.includes(c)) return;
                name = c.replace("combat-group-info-player-", "");
            });

            let member = false;
            self.robot.extensions.PlayerStatus.group.forEach((m) => {
                if (m.username === name) member = m;
            });
            if (!member) return;

            let tooltip = M.Tooltip.init(e, {
                position: "right",
                html: self.getGroupPopupTemplate(member),
            });

            this.tooltips.push(tooltip);
        });
    }

    destroyGroupTooltips() {
        let tooltip;
        while ((tooltip = this.tooltips.shift())) {
            tooltip.destroy();
        }
    }

    setupObservers() {
        this.setupGroupCombatObserver();
    }

    startObservers() {
        for (let k in this.observers) {
            let o = this.observers[k];
            o.observer.observe(o.target, o.options);
        }
    }

    destroyObservers() {
        for (let o in this.observers) {
            this.observers[o].observer.disconnect();
            delete this.observers[o];
        }
    }

    setupGroupCombatObserver() {
        let observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    if (!mutation.target.classList.contains("play-area")) continue;

                    for (const node of mutation.addedNodes) {
                        if (!node.classList.contains("group-combat-main")) continue;

                        this.setupGroupTooltips();
                    }
                } else if (mutation.removedNodes.length > 0) {
                    if (!mutation.target.classList.contains("play-area")) continue;

                    this.destroyGroupTooltips();
                }
            }
        });
        this.observers.groupCombatObserver = {
            observer: observer,
            target: document.querySelector(".play-area-container"),
            options: { attributes: true, childList: true, subtree: true },
        };
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

        this.stylesheets.groupTooltip = head.appendChild(document.createElement("style"));
        this.stylesheets.groupTooltip.className = "enragedrobot-groupui-stylesheet groupTooltip";
        this.stylesheets.groupTooltip.innerHTML = `
            .group-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr;
                column-gap: 10px;
                align-items: start;
                justify-items: stretch;
            }
            .group-popup {
                display: grid;
                grid-template-columns: 2fr 1fr;
                grid-template-rows: 1fr;
                column-gap: 1em;
                align-items: start;
                justify-items: start;
                margin-bottom: 14px;
            }
            .group-popup-header {
                grid-column-start: 1;
                grid-column-end: 3;
            }
            .group-popup h6 {
                font-size: 0.9em;
                font-weight: bold;
            }
        `;
    }

    destroyStylesheets() {
        for (let k in this.stylesheets) {
            this.stylesheets[k].remove();
            delete this.stylesheets[k];
        }
    }

    getGroupPopupEquipment(equipment) {
        let s = ``;
        for (const i in equipment) {
            let item = equipment[i];
            if (!item.hasOwnProperty("itemID")) continue;
            let itemData = IdlescapeData.items.get(item.itemID);
            s += `<div>${itemData.name}</div><div> +${item.augmentations}</div>`;
        }
        return s;
    }

    getGroupPopupEnchantments(enchantments) {
        let s = `<div></div><div></div>`;
        for (const enchantment of enchantments) {
            let valid = false;
            let stacks = "";
            for (let k in enchantment) {
                valid = true;
                stacks = k === "stacks" ? ` (${enchantment.stacks})` : stacks;
            }
            if (!valid) continue;

            let enchantmentData = IdlescapeData.enchantments.get(enchantment.enchantmentID);
            s += `<div>${enchantmentData.name}</div><div>${enchantment.enchantmentStrength}${stacks}</div>`;
        }
        return s;
    }

    getGroupPopupTemplate(member) {
        return `
    <div class="group-container">
        <div class="group-popup">
            <div class="group-popup-header"><h6>Defenses</h6></div>
            <div>Stab:</div><div>${member.combatStats.defenseBonus.stab}</div>
            <div>Slash:</div><div>${member.combatStats.defenseBonus.slash}</div>
            <div>Crush:</div><div>${member.combatStats.defenseBonus.crush}</div>
            <div>Magic:</div><div>${member.combatStats.defenseBonus.magic}</div>
            <div>Range:</div><div>${member.combatStats.defenseBonus.range}</div>
        </div>
        <div class="group-popup">
            <div class="group-popup-header"><h6>Attack</h6></div>
            <div>Strength:</div><div>${member.combatStats.strengthBonus.melee}</div>
            <div>Accuracy:</div><div>${member.combatStats.attackBonus.accuracy}</div>
            <div>Speed:</div><div>${member.combatStats.attackSpeed}</div>
        </div>
        <div class="group-popup">
            <div class="group-popup-header"><h6>Equipment</h6></div>
            ${this.getGroupPopupEquipment(member.equipment)}
        </div>
        <div class="group-popup">
            <div class="group-popup-header"><h6>Enchantments</h6></div>
            ${this.getGroupPopupEnchantments(member.activeEnchantments)}
        </div>
        <div class="group-popup">
            <div class="group-popup-header"><h6>Combat Buffs</h6></div>
            ${this.getGroupPopupEnchantments(member.combatBuffs)}
        </div>
    </div>
`;
    }

    toggleInviteNavFlash(event) {
        this.stylesheets.inviteNavFlash.disabled =
            event.data == null || (Array.isArray(event.data) && event.data.length === 0) || !this.robot.getOption("group.invite_nav_flash");
    }
}
