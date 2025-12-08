// sap.ui.define([
// 	"sap/ui/base/ManagedObject"
// ], function(
// 	ManagedObject
// ) {
// 	"use strict";

// 	return ManagedObject.extend("app.nwp3.model.formatter", {
// 	});
// });

sap.ui.define([
  "sap/ui/core/format/NumberFormat"
], (NumberFormat) => {
  "use strict";

  const DEFAULT_USD_TO_INR = 84.5; // set your fallback

  return {
    usdToInr: function (fUsd) {
      if (fUsd == null || isNaN(fUsd)) {
        return "";
      }

      // If a 'cfg' model is available, use its rate; else fallback
      let rate = DEFAULT_USD_TO_INR;
      const oView = this.getView ? this.getView() : null;
      const oCfg = oView?.getModel("cfg");
      if (oCfg) {
        const m = oCfg.getData?.() || {};
        if (typeof m.usdToInr === "number" && m.usdToInr > 0) {
          rate = m.usdToInr;
        }
      }

      const inrValue = fUsd * rate;

      const oCurrencyFormat = NumberFormat.getCurrencyInstance({
        currencyCode: false,
        maxFractionDigits: 2,
        minFractionDigits: 2
      });

      return oCurrencyFormat.format(inrValue, "INR");
    }
  };
});
