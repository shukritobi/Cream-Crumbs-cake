(() => {
  "use strict";
  ["asset1.js", "asset2.js", "asset3.js", "asset4.js", "asset5.js", "asset6.js"].forEach((src) => {
    document.write(`<script src="${src}"><\/script>`);
  });
})();
