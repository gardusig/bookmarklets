(function () {
  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    document.body.appendChild(script);
  }

  loadScript(
    "https://gardusig.github.io/bookmarklet/dupla-sena.js",
    function () {
      if (
        typeof DuplaSena !== "undefined" &&
        typeof DuplaSena.runContestsFromInput === "function" &&
        typeof DuplaSena.proceedToPayment === "function"
      ) {
        (async function () {
          await DuplaSena.runContestsFromInput();
          await DuplaSena.proceedToPayment();
        })();
      } else {
        console.error("Failed to load shared library");
      }
    }
  );
})();
