class EnragedRobot {
    constructor() {
        this.uiEvents = new EventTarget();
        this.extensions = {};
        this.setupStorage();
        this.uiEvents.addEventListener(ERC.UI_EVENTS.TOGGLE_EXTENSION, (e) => this.extensionHandler(e));
    }

    setupStorage() {
        if (!localStorage.hasOwnProperty(ERC.STORAGE_KEY)) {
            localStorage.setItem(ERC.STORAGE_KEY, JSON.stringify(ERC.DEFAULT_SETTINGS));
        }
        try {
            JSON.parse(localStorage.getItem(ERC.STORAGE_KEY));
        } catch {
            localStorage.setItem(ERC.STORAGE_KEY, JSON.stringify(ERC.DEFAULT_SETTINGS));
        }
        let userVersion = this.getOption("storage_version", 0);
        if (userVersion < ERC.STORAGE_VERSION) this.upgradeStorage(userVersion);
    }

    upgradeStorage(userVersion) {
        while (userVersion < ERC.STORAGE_VERSION) {
            if (userVersion === 0) {
                localStorage.setItem(ERC.STORAGE_KEY, JSON.stringify(ERC.DEFAULT_SETTINGS));
                this.setOption("storage_version", ++userVersion);
                console.log("EnragedRobot: Upgraded to storage version 1");
            } else if (userVersion === 1) {
                this.setOption("enchants", this.getOption("enchantments"));
                this.setOption("enchants.destructive_color", ERC.DEFAULT_SETTINGS.enchants.destructive_color);
                this.deleteOption("enchantments");
                this.setOption("combat", this.getOption("ui"));
                this.deleteOption("ui");
                this.setOption("storage_version", ++userVersion);
                console.log("EnragedRobot: Upgraded to storage version 2");
            }
        }
    }

    getOption(key, defaultValue = null) {
        let settings = JSON.parse(localStorage.getItem(ERC.STORAGE_KEY)),
            option = settings;

        let keys = key.split(".");
        let k;
        while ((k = keys.shift())) {
            if (option.hasOwnProperty(k)) {
                option = option[k];
            } else {
                option = defaultValue;
                break;
            }
        }
        return option;
    }

    setOption(key, value, overwrite = false) {
        let settings = JSON.parse(localStorage.getItem(ERC.STORAGE_KEY));
        let keys = key.split("."),
            s = settings,
            k;

        while ((k = keys.shift())) {
            if (keys.length > 0) {
                if (typeof s[k] !== "object") {
                    if (typeof s[k] !== "undefined" && !overwrite) {
                        console.error("EnragedRobot: option key exists and is not an object but overwrite is false");
                        return;
                    }
                    s[k] = {};
                }
                s = s[k];
            } else {
                s[k] = value;
            }
        }
        localStorage.setItem(ERC.STORAGE_KEY, JSON.stringify(settings));
    }

    deleteOption(key) {
        let settings = JSON.parse(localStorage.getItem(ERC.STORAGE_KEY));
        let keys = key.split("."),
            s = settings,
            k;

        while ((k = keys.shift())) {
            if (keys.length > 0) {
                if (typeof s[k] !== "object") {
                    console.error(`EnragedRobot: Trying to delete option from non-existent nest: ${key}`);
                    return;
                }
                s = s[k];
            } else {
                delete s[k];
            }
        }
        localStorage.setItem(ERC.STORAGE_KEY, JSON.stringify(settings));
    }

    loadExtensions() {
        this.extensions.PlayerStatus = new PlayerStatus(this);
        this.extensions.Settings = new Settings(this);
        this.extensions.Tooltips = new Tooltips(this);
        this.extensions.CombatUI = new CombatUI(this);
        this.extensions.EnchantsUI = new EnchantsUI(this);
    }

    uiEventHandler(event, data) {
        this.uiEvents.dispatchEvent(new UIEvent(event, data));
    }

    extensionHandler(event) {
        if (this.extensions.hasOwnProperty(event.data.extension)) {
            if (event.data.enabled) this.extensions[event.data.extension].enable();
            else this.extensions[event.data.extension].disable();
        }
    }
}

class UIEvent extends Event {
    constructor(event, data) {
        super(event);
        this.data = data;
    }
}
