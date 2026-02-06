
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "app/nwp3/model/formatter"

], (Controller, History, formatter) => {
  "use strict";

  return Controller.extend("app.nwp3.controller.DetailView", {
    formatter:formatter,
    onInit() {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("ProductDetail").attachPatternMatched(this._onMatched, this);

        console.log("cfg model in Detail:", this.getView().getModel("cfg"));
    },


_onMatched(oEvent) {
  const productId = oEvent.getParameter("arguments").ProductID; // e.g., "1" or 1
  // Ensure numeric key (Products) → no quotes needed
  this.getView().bindElement({
    path: `/Products(${productId})`,
    parameters: { expand: "Category,Supplier" },
    events: {
      dataRequested: () => this.getView().setBusy(true),
      dataReceived: () => this.getView().setBusy(false)
    }
  });
        console.log("[Detail] bound to /Products(" + productId + ")");
}
,


    onNavBack() {
      const sPrev = History.getInstance().getPreviousHash();
      if (sPrev !== undefined) {
        window.history.go(-1);
      } else {
        this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
      }
    }
,

    formatStockStatus(unitsInStock) {
      const text = `Stock: ${unitsInStock}`;
      const state = unitsInStock > 0 ? "Success" : "Error";
           return [new sap.m.ObjectStatus({ text, state })];
    }
  });
});