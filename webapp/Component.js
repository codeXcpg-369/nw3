sap.ui.define([
    "sap/ui/core/UIComponent",
    "app/nwp3/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("app.nwp3.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ],

            dependencies: {
                libs: ["sap.m", "sap.ui.comp", "sap.ui.layout"]
            }

        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");


            
            // enable routing
            this.getRouter().initialize();
            this.getRouter().navTo("RouteView1");
        }
    });
});