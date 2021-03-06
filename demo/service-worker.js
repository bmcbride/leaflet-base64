/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the 'License');
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an 'AS IS' BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
const PRECACHE = 'precache-05.09.19.3';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'manifest.json',
  'assets/img/apple-touch-icon.png',
  'assets/img/favicon-32x32.png',
  'assets/img/android-chrome-192x192.png',
  'assets/vendor/fontawesome-free-5.8.2-web/css/all.min.css',
  'assets/vendor/fontawesome-free-5.8.2-web/webfonts/fa-solid-900.ttf',
  'assets/vendor/fontawesome-free-5.8.2-web/webfonts/fa-solid-900.woff',
  'assets/vendor/leaflet-1.5.1/images/layers.png',
  'assets/vendor/leaflet-1.5.1/images/layers-2x.png',
  'assets/vendor/leaflet-1.5.1/images/marker-icon.png',
  'assets/vendor/leaflet-1.5.1/images/marker-icon-2x.png',
  'assets/vendor/leaflet-1.5.1/images/marker-shadow.png',
  'assets/vendor/leaflet-1.5.1/leaflet.css',
  'assets/vendor/leaflet-1.5.1/leaflet.js',
  'assets/vendor/leaflet-locatecontrol-0.66.2/L.Control.Locate.min.css',
  'assets/vendor/leaflet-locatecontrol-0.66.2/L.Control.Locate.min.css.map',
  'assets/vendor/leaflet-locatecontrol-0.66.2/L.Control.Locate.min.js',
  'assets/vendor/leaflet-locatecontrol-0.66.2/L.Control.Locate.min.js.map',
  'assets/vendor/Leaflet.TileLayer.Base64/Leaflet.TileLayer.Base64.js',
  'data/14782_1.json'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(response => {
          return response;
        });
      })
    );
  }
});