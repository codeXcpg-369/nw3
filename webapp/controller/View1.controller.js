// sap.ui.define([
//   "sap/ui/core/mvc/Controller",
//   "sap/ui/model/Filter",
//   "sap/ui/model/FilterOperator",
//   "app/nwp3/model/formatter"
// ], (Controller, Filter, FilterOperator, formatter) => {
//   "use strict";

//   return Controller.extend("app.nwp3.controller.View1", {
//     formatter: formatter,
//     onInit() {
//     },

//     onSearch: function () {
//       let aFilter = [];
//       let slocId = this.getView().byId("idFilterloc").getValue();
//       let sdescId = this.getView().byId("idFilterdesc").getValue();
//       let scatId = this.getView().byId("idFilterCat").getValue();

//       if (slocId) {
//         let filterName = new Filter("ProductName", FilterOperator.Contains, slocId);
//         aFilter.push(filterName);
//       }
//       if (sdescId) {
//         let filterName = new Filter("Supplier/CompanyName", FilterOperator.Contains, sdescId);
//         aFilter.push(filterName);
//       }
//       if (scatId) {
//         let filterName = new Filter("Category/CategoryName", FilterOperator.Contains, scatId);
//         aFilter.push(filterName);
//       }
//       let oTable = this.getView().byId("productsList");
//       let oBinding = oTable.getBinding("items");
//       oBinding.filter(aFilter);
//     },



//             onSort: function () {
//             //for first time, it is undefined
//             if (!this.bDescending) {
//                 this.bDescending = false;
//             }
//             let oSorter = new sap.ui.model.Sorter("ProductName", this.bDescending);
//             let oList = this.getView().byId("productsList");
//             let oBinding = oList.getBinding("items");
//             oBinding.sort(oSorter);
//             this.bDescending = !this.bDescending;

//         },





//     onProductPress(oEvent) {
//       const oItem = oEvent.getSource();
//       const oCtx = oItem.getBindingContext();
//       const productId = oCtx.getProperty("ProductID");
//       this.getOwnerComponent().getRouter().navTo("ProductDetail", { ProductID: String(productId) });
//     }
//   });
// });




































//automatically converts usd to inr (current market)


sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "app/nwp3/model/formatter"
], (Controller, Filter, FilterOperator, JSONModel, formatter) => {
  "use strict";

  return Controller.extend("app.nwp3.controller.View1", {
    formatter: formatter,

onInit() {
  const oCfg = new JSONModel({
    usdToInr: null,
    rateLastUpdatedAt: null
  });

  this.getOwnerComponent().setModel(oCfg, "cfg");

  this._loadUsdToInrRate();
},

_loadUsdToInrRate: async function () {
  const resp = await fetch("/fx/live");
  const data = await resp.json();

  const rate = Number(data?.quotes?.USDINR);
  if (Number.isFinite(rate) && rate > 0) {
    const oCfg = this.getOwnerComponent().getModel("cfg");
    oCfg.setProperty("/usdToInr", rate);
    oCfg.setProperty("/rateLastUpdatedAt", new Date().toISOString());
  }
},

    onSearch: function () {
      let aFilter = [];
      let slocId = this.getView().byId("idFilterloc").getValue();
      let sdescId = this.getView().byId("idFilterdesc").getValue();
      let scatId = this.getView().byId("idFilterCat").getValue();

      if (slocId) {
        let filterName = new Filter("ProductName", FilterOperator.Contains, slocId);
        aFilter.push(filterName);
      }
      if (sdescId) {
        let filterName = new Filter("Supplier/CompanyName", FilterOperator.Contains, sdescId);
        aFilter.push(filterName);
      }
      if (scatId) {
        let filterName = new Filter("Category/CategoryName", FilterOperator.Contains, scatId);
        aFilter.push(filterName);
      }
      let oTable = this.getView().byId("productsList");
      let oBinding = oTable.getBinding("items");
      oBinding.filter(aFilter);
    },

    onSort: function () {
      if (!this.bDescending) {
        this.bDescending = false;
      }
      let oSorter = new sap.ui.model.Sorter("ProductName", this.bDescending);
      let oList = this.getView().byId("productsList");
      let oBinding = oList.getBinding("items");
      oBinding.sort(oSorter);
      this.bDescending = !this.bDescending;
    },

    onProductPress(oEvent) {
      const oItem = oEvent.getSource();
      const oCtx = oItem.getBindingContext();
      const productId = oCtx.getProperty("ProductID");
      this.getOwnerComponent().getRouter().navTo("ProductDetail", { ProductID: String(productId) });
    }
  });
});