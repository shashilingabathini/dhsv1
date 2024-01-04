define([
	"dojo/_base/declare",
	"ecm/widget/dialog/BaseDialog",
	"ecm/widget/TextBox",
	"ecm/widget/DatePicker",
	"ecm/widget/Select",
	"dijit/form/Button",
	"gridx/Grid",
	"dojo/data/ItemFileWriteStore",
	"ecm/model/Request",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/dom-style",
	"ecm/widget/dialog/MessageDialog",
	"dojo/text!./templates/ServiceIdDialog.html",
	"gridx/core/model/cache/Sync",
	"gridx/modules/ColumnResizer",
	"gridx/modules/HiddenColumns"

],function(declare,BaseDialog,TextBox,DatePicker,Select,Button,Grid,ItemFileWriteStore,Request,lang,connect,domStyle,MessageDialog,template){
	return declare("dHSPluginDojo.widget.dialog.ServiceIdDialog",[BaseDialog],{

		contentString: template,
		widgetsInTemplate: true,
        postCreate : function() {
			this.inherited(arguments);
			this.setTitle("ServiceId  Search");
			this.setExpandable(false);
			this._setEmptyGrid();
			this.setSize(600,650);
		},
		_setEmptyGrid : function() {
			var gridData = {
					identifier: 'id',
					items: []
			};
			var store = new ItemFileWriteStore({
		        data: gridData
		    });
			var COLUMNS = [];
            this._setGridStructure(COLUMNS);
			this.lookupDataGrid.setStore(store);
		},
		_apiSearch : function() {
            var isMandatoryMissed   = this.checkMandatory()
            if(isMandatoryMissed) {
                 var message =  new MessageDialog({
                                      text : 'Please fill atleast one mandatory field .(Marked * as mandatory)'
                                   });
                 message.show();
                 return;
            }
             var requestParams = {};
            requestParams['serviceID'] = this._serviceId.get("value");
            requestParams['nameSearchType'] = "";
            requestParams['keywords'] = "";
            requestParams['serviceTypeCode'] = "";
            requestParams['tin'] =  this._providerTin.get("value") ;
            console.dir(requestParams)
			Request.invokePluginService("DHSPlugin","LookupServiceId",{
				requestParams : requestParams,
				requestCompleteCallback : lang.hitch(this,function(data) {
					console.dir(data);
					if(data.error == null && data.status === "success") {
						this._setGridStructure(data.results.columns);
						this._setGridStore(data.results.rows);
					} else {
					    var message =  new MessageDialog({
					        text : 'An error while fetching details'
					    });
					    message.show();
					}
				}),
				requestFailedCallback :lang.hitch(this,function(data) {
				    var message =  new MessageDialog({
                		text : 'An error while fetching details'
                    });
                    message.show();
				})
			});
		},
		checkMandatory :  function() {
		    var missedMandatory = false
		    if(this._serviceName.get("value") === ""  && this._serviceId.get("value") === "" && this._providerName.get("value") === "" && this._providerTin.get("value") === "") {
                missedMandatory = true
            }
            return missedMandatory
		},
		_setGridStructure : function(columns) {
			var gridLayout = [];
			var colWidth = "120px";
			for(var x = 0 ; x < columns.length ; x++) {
				gridLayout.push({id:x+1,field:columns[x].value,name:columns[x].displayName,width:colWidth});
			}
			this.lookupDataGrid.setColumns(gridLayout);
			this.lookupDataGrid.hiddenColumns.add("providerID","providerTIN");
		},
		_setGridStore : function(rows) {
			var gridData = {
					identifier: 'id',
					items: []
				};
			var _items = [];
			for(var x = 0; x < rows.length ; x++) {
				var rowData = {};
				Object.keys(rows[x]).forEach(function(key) {
					  rowData[key] = rows[x][key];
				});
				rowData["id"] = x + 1;
				_items.push(rowData);
			}
			gridData.items = _items;
			var store = new ItemFileWriteStore({
		        data: gridData
		    });
		    console.dir(store)
			this.lookupDataGrid.setStore(store);
			var _this = this;
			connect.connect(this.lookupDataGrid, "onRowClick", this, lang.hitch(this,function(event){
				var selectedRowIndex = event.rowId;
				var selectRowData = this.lookupDataGrid.model.byId(selectedRowIndex);
				// set field data here
				console.log(selectRowData);
				window.batch.container.controller.getPropertyController("DC_Batch","ServiceID").set("value",selectRowData.rawData.serviceID);
				window.batch.container.controller.getPropertyController("DC_Batch","ServiceName").set("value",selectRowData.rawData.serviceName);
				window.batch.container.controller.getPropertyController("DC_Batch","ServiceStatus").set("value",selectRowData.rawData.status);
				window.batch.container.controller.getPropertyController("DC_Batch","ProviderName").set("value",selectRowData.rawData.providerName);
				window.batch.container.controller.getPropertyController("DC_Batch","ProviderID").set("value",selectRowData.rawData.providerID);
				window.batch.container.controller.getPropertyController("DC_Batch","ProviderTIN").set("value",selectRowData.rawData.providerTIN);
				_this.hide();
			}));
			this.lookupDataGrid.resize();
			this.lookupDataGrid.startup();
		}
	});
});