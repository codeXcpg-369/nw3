// sap.ui.define([
//   "sap/ui/core/format/NumberFormat"
// ], (NumberFormat) => {
//   "use strict";

//   const DEFAULT_USD_TO_INR = 84.5; // set your fallback

//   return {
//     usdToInr: function (fUsd) {
//       if (fUsd == null || isNaN(fUsd)) {
//         return "";
//       }

//       // If a 'cfg' model is available, use its rate; else fallback
//       let rate = DEFAULT_USD_TO_INR;
//       const oView = this.getView ? this.getView() : null;
//       const oCfg = oView?.getModel("cfg");
//       if (oCfg) {
//         const m = oCfg.getData?.() || {};
//         if (typeof m.usdToInr === "number" && m.usdToInr > 0) {
//           rate = m.usdToInr;
//         }
//       }

//       const inrValue = fUsd * rate;

//       const oCurrencyFormat = NumberFormat.getCurrencyInstance({
//         currencyCode: false,
//         maxFractionDigits: 2,
//         minFractionDigits: 2
//       });

//       return oCurrencyFormat.format(inrValue, "INR");
//     }
//   };
// });


// app/nwp3/model/formatter.js
sap.ui.define(["sap/ui/core/format/NumberFormat"], (NumberFormat) => {
  "use strict";

  const DEFAULT_USD_TO_INR = 84.5;

  return {
    usdToInr: function (fUsd) {
      if (fUsd == null || isNaN(fUsd)) return "";
      let rate = DEFAULT_USD_TO_INR;
      const view = this.getView ? this.getView() : null;
      const cfg = view?.getModel("cfg");
      if (cfg) {
        const m = cfg.getData?.() || {};
        if (typeof m.usdToInr === "number" && m.usdToInr > 0) rate = m.usdToInr;
      }
      const fmt = NumberFormat.getCurrencyInstance({ currencyCode: false, maxFractionDigits: 2, minFractionDigits: 2 });
      return fmt.format(fUsd * rate, "INR");
    },

    /**
     * Northwind V2 category images are BMP wrapped with an OLE header.
     * We: base64-decode → strip header (~78 bytes) → base64-encode again → return Data-URI.
     * Data-URIs render reliably in ObjectListItem.icon.
     */
    categoryIconDataUri: function (oleWrappedBase64) {
      try {
        if (!oleWrappedBase64 || typeof oleWrappedBase64 !== "string") return "";

        // 1) base64 → binary string
        const bin = atob(oleWrappedBase64);

        // 2) strip OLE header (commonly 78 bytes in Northwind images)
        const OLE_HEADER_LEN = 78;
        if (bin.length <= OLE_HEADER_LEN) return "";

        const bmpBin = bin.slice(OLE_HEADER_LEN);

        // 3) binary → base64 (clean)
        const cleanBase64 = btoa(bmpBin);

        // 4) return Data-URI (BMP)
        return `data:image/bmp;base64,${cleanBase64}`;
      } catch (e) {
        // As a last resort, send as-is (may not render due to OLE header)
        return `data:image/bmp;base64,${oleWrappedBase64}`;
      }
    },
 
// formatter.js (data-URI after stripping OLE header; reused from list)

categoryImageDataUri: function (base64WithOle) {
  try {
    if (!base64WithOle) return "";
    const bin = atob(base64WithOle);
    const OLE_HEADER_LEN = 78;
    if (bin.length <= OLE_HEADER_LEN) return "";
    const cleanBin = bin.slice(OLE_HEADER_LEN);

    // Re-encode to base64 (clean BMP)
    let bytesStr = "";
    for (let i = 0; i < cleanBin.length; i++) {
      bytesStr += String.fromCharCode(cleanBin.charCodeAt(i) & 0xff);
    }
    const cleanB64 = btoa(bytesStr);

    return `data:image/bmp;base64,${cleanB64}`;
  } catch (e) {
    // Fallback: return original (may not render because of OLE header)
    return `data:image/bmp;base64,${base64WithOle}`;
  }
}



  };
});
