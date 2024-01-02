const INSTALLED_AT_KEY = "installedAt";
const UPDATE_POPUP_RESTRICTION_KEY = "updatePopupRestriction";

const IS_ADDITIONAL_BLOCKING_ENABLED = "isAdditionalBlockingEnabled";

const API_URL = "https://api.adblock-for-youtube.com";

const youtubeAdRegexesFallback = [
  "(googleads.g.doubleclick.net)",
  "(=adunit&)",
  "(/pubads.)",
  "(/pubads_)",
  "(/api/ads/)",
  "(/googleads_)",
  "(innovid.com)",
  "(/pagead/lvz?)",
  "(/pagead/gen_)",
  "(doubleclick.com)",
  "(google.com/pagead/)",
  "(youtube.com/pagead/)",
  "(googlesyndication.com)",
  "(www.youtube.com/get_midroll_)",
].join("|");

const adBlockingSelectorsFallback = [
  "#player-ads",
  "#merch-shelf",
  "#masthead-ad",
  "#offer-module",
  ".ytp-ad-button",

  "ytd-ad-slot-renderer",
  ".ytd-ad-slot-renderer",
  ".ytp-ad-progress-list",

  ".ytd-merch-shelf-renderer",
  "ytd-companion-slot-renderer",
  ".ytd-companion-slot-renderer",
  ".ytd-in-feed-ad-layout-renderer",
  ".ytd-action-companion-ad-renderer",
  ".ytp-ad-player-overlay-flyout-cta",
  "ytd-promoted-sparkles-web-renderer",

  ".ad-showing > .html5-video-container",
  ".ytd-player-legacy-desktop-watch-ads-renderer",
  ".ytd-rich-item-renderer > ytd-ad-slot-renderer",
  'a[href^="https://www.googleadservices.com/pagead/aclk?"]',
  "#contents > ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer)",

  "ytd-display-ad-renderer",
  ".ytd-carousel-ad-renderer",
  "ytd-compact-promoted-video-renderer",
  ".ytd-promoted-sparkles-text-search-renderer",
  ".masthead-ad-control",
  "#ad_creative_3",
  "#footer-ads",

  "ytd-promoted-video-renderer",
  ".ad-container",
  ".ad-div",
  ".video-ads",
  ".ytd-mealbar-promo-renderer",
  ".sparkles-light-cta",
  "#watch-channel-brand-div",
  "#watch7-sidebar-ads",

  '[target-id="engagement-panel-ads"]',
].join(",");

const dailymotionAdBlockingSelectorsFallback = [
  'div[class^="NewWatchingDiscovery__adSection"]',
  'div[class^="DisplayAd"]',
].join(",");

const dailymotionAdRegexFallback = [].join("|");

// const defaultPopupConfig = {
//   type: "mobile",
//   isEnabled: false,
//   doNotShowAgainMinutes: 120,
// };

const defaultPopupsConfig = {
  isAntiAdblockPopupEnabled: false,
  isUpdatePopupEnabled: false,
  isRateUsPopupEnabled: false,
  isOtherStreamingPopupEnabled: false,
  configurablePopup: {
    type: "mobile",
    isEnabled: false,
    doNotShowAgainMinutes: 120,
  },
};

const settings = {
  ads: localStorage.ads === "true",
  annotations: localStorage.ads === "true",
  youtubeAdRegex: new RegExp(
    localStorage.youtubeAdRegex || youtubeAdRegexesFallback
  ),
  adBlockingSelectors:
    localStorage.adBlockingSelectors || adBlockingSelectorsFallback,
  dailymotionAdRegex: new RegExp(
    localStorage.dailymotionAdRegex || dailymotionAdRegexFallback
  ),
  dailymotionAdBlockingSelectors:
    localStorage.dailymotionAdBlockingSelectors ||
    dailymotionAdBlockingSelectorsFallback,
  popupConfig: defaultPopupsConfig,
};

const initializeSettings = () => {
  chrome.storage.local.get([IS_ADDITIONAL_BLOCKING_ENABLED], (result) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return;
    }

    const installedAt = result[IS_ADDITIONAL_BLOCKING_ENABLED];

    if (installedAt) {
      settings.isAdditionalBlockingEnabled = true;
    }
  });
};

const setResponseFields = (fieldName, value) => {
  localStorage[fieldName] = value;
  settings[fieldName] = value;
};

const updateYoutubeAdRegexes = () => {
  fetch(
    `${API_URL}/api/v1/adregex?version=${chrome.runtime.getManifest().version}`
  )
    .then((response) => response.json())
    .then((response) => {
      const {
        regexRules,
        adBlockingSelectors,
        popupConfig,
        dailymotionAdRegex,
        dailymotionAdBlockingSelectors,
      } = response;

      const formattedRegex = regexRules.join("|");
      const formattedAdBlockingSelectors = adBlockingSelectors.join(",");

      settings.popupConfig = popupConfig || defaultPopupsConfig;

      localStorage.youtubeAdRegex = formattedRegex;
      settings.youtubeAdRegex = new RegExp(formattedRegex);

      setResponseFields("adBlockingSelectors", formattedAdBlockingSelectors);

      const dailymotionFormattedRegex =
        dailymotionAdRegex?.join("|") || dailymotionAdRegexFallback;

      const formattedDailymotionAdBlockingSelectors =
        dailymotionAdBlockingSelectors?.join(",") ||
        dailymotionAdBlockingSelectorsFallback;

      localStorage.dailymotionAdRegex = dailymotionFormattedRegex;
      settings.dailymotionAdRegex = new RegExp(dailymotionFormattedRegex);
      setResponseFields(
        "dailymotionAdBlockingSelectors",
        formattedDailymotionAdBlockingSelectors
      );
    })
    .catch((e) => {
      console.error(e);
    });
};

const setInstalledAtKey = () => {
  chrome.storage.local.get([INSTALLED_AT_KEY], (result) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return;
    }

    const installedAt = result[INSTALLED_AT_KEY];

    if (!installedAt) {
      chrome.storage.local.set({ [INSTALLED_AT_KEY]: Date.now() }, () => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      });
    }
  });
};

const init = async () => {
  const YOUTUBE_REGEX = /^https?:\/\/(\w*.)?youtube.com/i;
  const DAILY_MOTION_REGEX = /^https?:\/\/(\w*.)?dailymotion.com/i;
  const YOUTUBE_ANNOTATIONS_REGEX =
    /^https?:\/\/(\w*.)?youtube\.com\/annotations_invideo\?/;
  const tabTracker = new Set();
  const dailyMotionTabTracker = new Set();

  initializeSettings();
  setInstalledAtKey();
  updateYoutubeAdRegexes();

  // Sync setting changes from other conext parts of the extension
  window.addEventListener("storage", ({ key, newValue }) => {
    console.log("storage", key, newValue);
    if (["ads", "annotations"].includes(key)) {
      settings[key] = newValue === "true";
    }

    if (key === "ads") {
      for (const tabId of tabTracker) {
        chrome.tabs.reload(tabId);
      }
      for (const dailyMotionTab of dailyMotionTabTracker) {
        chrome.tabs.reload(dailyMotionTab);
      }
    }
  });

  // Find Youtube Tabs and add them to the tabTracker
  chrome.webRequest.onBeforeRequest.addListener(
    ({ tabId, url }) => {
      if (YOUTUBE_REGEX.test(url)) {
        tabTracker.add(tabId);
      } else if (
        DAILY_MOTION_REGEX.test(url) &&
        settings.isAdditionalBlockingEnabled
      ) {
        dailyMotionTabTracker.add(tabId);
      } else {
        tabTracker.delete(tabId);
      }
    },
    {
      urls: ["http://*/*", "https://*/*"],
      types: ["main_frame"],
    }
  );

  chrome.runtime.onMessage.addListener(
    ({ action, href, message }, { tab }, sendResponse) => {
      if (action === "PAGE_READY") {
        const response = {
          yt: tabTracker.has(tab.id),
          isDailymotionTab: dailyMotionTabTracker.has(tab.id),
          enabled: settings.ads,
          adBlockSelectors: settings.adBlockingSelectors,
          dailymotionAdBlockingSelectors:
            settings.dailymotionAdBlockingSelectors,
          popupConfig: settings.popupConfig,
        };
        sendResponse(response);
      } else if (action === "ENABLE_ADDITIONAL_BLOCKING") {
        settings.isAdditionalBlockingEnabled = true;
        chrome.storage.local.set(
          { [IS_ADDITIONAL_BLOCKING_ENABLED]: true },
          () => {
            if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError);
            }
          }
        );
        sendResponse(true);
      }
    }
  );

  // Block ad/annotation request inside youtube tabs
  chrome.webRequest.onBeforeRequest.addListener(
    ({ tabId, url }) => {
      // Check if youtube tab
      if (tabTracker.has(tabId)) {
        if (settings.ads && settings.youtubeAdRegex.test(url)) {
          return { cancel: true };
        }

        if (settings.annotations && YOUTUBE_ANNOTATIONS_REGEX.test(url)) {
          return { cancel: true };
        }
      }

      if (
        dailyMotionTabTracker.has(tabId) &&
        settings.dailymotionAdRegex.toString() !== "/(?:)/"
      ) {
        if (settings.ads && settings.dailymotionAdRegex.test(url)) {
          return { cancel: true };
        }
      }
    },
    {
      urls: ["http://*/*", "https://*/*"],
      types: ["script", "image", "xmlhttprequest", "sub_frame"],
    },
    ["blocking"]
  );
};
init();

const details = chrome.runtime.getManifest();

var installUrl = `https://get.adblock-for-youtube.com/install?v=${details.version}&xtid=${chrome.runtime.id}`;
var uninstallUrl = `https://get.adblock-for-youtube.com/uninstall?v=${details.version}&xtid=${chrome.runtime.id}`;

chrome.runtime.setUninstallURL(uninstallUrl);

chrome.runtime.onInstalled.addListener(({ reason }, previousVersion) => {
  if (reason === "install") {
    // Initially set settings
    localStorage.ads = settings.ads = true;
    localStorage.annotations = settings.annotations = false;
    chrome.tabs.create({ url: installUrl });
  }

  if (reason === "update") {
    chrome.storage.local.remove([UPDATE_POPUP_RESTRICTION_KEY], () => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });

    // Migrate old settings
    if (localStorage.adblockEnabled) {
      try {
        localStorage.ads = settings.ads = JSON.parse(
          localStorage.adblockEnabled
        ).data;
        localStorage.annotations = settings.annotations = JSON.parse(
          localStorage.annotationsBlockEnabled
        ).data;
        delete localStorage.adblockEnabled;
        delete localStorage.annotationsBlockEnabled;
        delete localStorage.autoUpdate;
      } catch (error) {}
    }
  }
});

// reload every 24h to calculate DAU
setTimeout(function () {
  window.location.reload();
}, 86400 * 1000);
