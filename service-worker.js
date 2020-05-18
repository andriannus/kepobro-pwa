const ICON_SIZES = ["72", "96", "128", "144", "152", "192", "384", "512"];
const IMAGES = ["404.png", "logo.png", "photo.jpg"];
const SCRIPTS = ["api", "index", "materialize.min"];
const STYLES = ["index", "materialize.min"];

const getAssetFiles = (fileType) => {
  const folderPath = "/assets";

  switch (fileType) {
    case "icon": {
      const iconFiles = ICON_SIZES.map(
        (iconSize) => `${folderPath}/icons/icon-${iconSize}x${iconSize}.png`
      );

      return iconFiles;
    }

    case "image": {
      const imageFiles = IMAGES.map((image) => `${folderPath}/images/${image}`);

      return imageFiles;
    }

    case "script": {
      const scriptFiles = SCRIPTS.map(
        (script) => `${folderPath}/scripts/${script}.js`
      );

      return scriptFiles;
    }

    case "style": {
      const styleFiles = STYLES.map(
        (style) => `${folderPath}/styles/${style}.css`
      );

      return styleFiles;
    }
  }
};

const CACHE = {
  name: "kepobro-v1",
  urls: [
    "/",
    "/index.html",
    "/manifest.json",
    "/pages/about.html",
    "/pages/home.html",
    "/pages/contact.html",
    ...getAssetFiles("icon"),
    ...getAssetFiles("image"),
    ...getAssetFiles("script"),
    ...getAssetFiles("style"),
  ],
};

self.addEventListener("install", (event) => {
  const preCache = async () => {
    const cache = await caches.open(CACHE.name);

    return cache.addAll(CACHE.urls);
  };

  event.waitUntil(preCache());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE.name);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }

      return fetch(event.request);
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const updatedCache = cacheNames.map((cacheName) => {
        if (cacheName !== CACHE.name) {
          return caches.delete(cacheName);
        }
      });

      return Promise.all(updatedCache);
    })
  );
});
