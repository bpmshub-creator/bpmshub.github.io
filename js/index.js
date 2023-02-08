navigator.serviceWorker.register(location.origin + "/sw.js");

const jsdelivr = document.createElement("script");
jsdelivr.setAttribute("src", "https://cdn.jsdelivr.net/gh/3kh0/3kh0.github.io/js/main.js");
document.head.append(jsdelivr);

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}
if (tabData.title) {
  document.title = tabData.title;
}
if (tabData.icon) {
  document.querySelector("link[rel='icon']").href = tabData.icon;
}

var theme = localStorage.getItem("theme") || "default";

document.body.setAttribute("theme", theme);

class changelogAdded extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" added></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-added", changelogAdded);

class changelogRemoved extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" removed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-removed", changelogRemoved);

class changelogChanged extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" changed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-changed", changelogChanged);

function foundSecretTheme(name) {
  document.body.setAttribute("theme", name);
  localStorage.setItem("theme", name);
  localStorage.setItem(name, "true");
  if (document.querySelector("." + name)) {
    document.querySelector("." + name).removeAttribute("hidden");
  }
}

function secretThemeButton(name) {
  if (localStorage.getItem(name) == "true") {
    if (document.querySelector("." + name)) {
      document.querySelector("." + name).removeAttribute("hidden");
    }
  }
}

function createSecretThemeType(name, pattern) {
window[name + "pattern"] = pattern;
window[name + "current"] = 0;
  
var themePattern = window[name + "pattern"]
var themeCurrent = window[name + "current"]

document.addEventListener("keydown", function (e) {
  if (e.key !== themePattern[themeCurrent]) {
    return (themeCurrent = 0);
  }

  themeCurrent++;

  if (themePattern.length == themeCurrent) {
    themeCurrent = 0;
    foundSecretTheme(name);
  }
});
  
secretThemeButton(name)
}

createSecretThemeType("nebelung", ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"])
createSecretThemeType("piplup", ["p", "i", "p", "l", "u", "p", "i", "s", "c", "o", "o", "l"])
createSecretThemeType("forternish", ["c", "o", "m", "i", "c", "s", "a", "n", "s"])
