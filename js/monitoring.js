(function () {
  window.dregalReportError = function (error, context = {}) {
    const event = { message: String(error?.message || error), stack: error?.stack || null, context, route: location.pathname, at: new Date().toISOString() };
    window.dregalErrorQueue = [...(window.dregalErrorQueue || []), event].slice(-50);
    window.dispatchEvent(new CustomEvent("dregal:error", { detail: event }));
  };
  window.addEventListener("error", (event) => window.dregalReportError(event.error || event.message, { source: "window" }));
  window.addEventListener("unhandledrejection", (event) => window.dregalReportError(event.reason, { source: "promise" }));
})();
