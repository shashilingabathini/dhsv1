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
	"dojo/text!./templates/LookupDialog.html",
	"gridx/core/model/cache/Sync",
	"gridx/modules/ColumnResizer"
	
],function(declare,BaseDialog,TextBox,DatePicker,Select,Button,Grid,ItemFileWriteStore,Request,lang,connect,domStyle,template){
	return declare("dHSPluginDojo.widget.dialog.LookupDialog",[BaseDialog],{
		
		contentString: template,
		widgetsInTemplate: true,

		postCreate : function() {
			this.inherited(arguments);
			this.setTitle("Search");
			this.setExpandable(false);
			this._setEmptyGrid();
		},
		_setEmptyGrid : function() {
			var gridData = {
					identifier: 'id',
					items: []
			};
			var store = new ItemFileWriteStore({  
		        data: gridData  
		    });
			this.lookupDataGrid.setStore(store);
		},
		_apiSearch : function() {
			var firstName  = this.firstName.get("value");
			var lastName  = this.lastName.get("value");
			var ssn  = this.ssn.get("value");
			var dob  = this.dob.get("value");
			var gender  = this.gender.get("value");
			
			var params  = {
					firstName : firstName,
					lastName : lastName,
					ssn : ssn,
					dob : dob,
					gender : gender
			};
			
			console.log(params);
			var rquestParams = {};
			Request.invokePluginService("DHSPlugin","LookupService",{
				requestParams : rquestParams,
				requestCompleteCallback : lang.hitch(this,function(data) {
					console.dir(data);
					if(data.error == null) {
						this._setGridStructure(data.results.columns);
						this._setGridStore(data.results.rows);
					}
				}),
				requestFailedCallback :lang.hitch(this,function(data) {
					alert('an error while processing request');
				})
			});
		},
		_setGridStructure : function(columns) {
			var gridLayout = [];
			var colWidth = "120px";
			for(var x = 0 ; x < columns.length ; x++) {
				gridLayout.push({id:x,field:columns[x].value,name:columns[x].displayName,width:colWidth});
			}
			this.lookupDataGrid.setColumns(gridLayout); 
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
				rowData["id"] = x;
				_items.push(rowData);
			}
			console.dir(_items);
			gridData.items = _items;
			var store = new ItemFileWriteStore({  
		        data: gridData  
		    });
			this.lookupDataGrid.setStore(store);
			var _this = this;
			connect.connect(this.lookupDataGrid, "onRowClick", this, lang.hitch(this,function(event){
				var selectedRowIndex = event.rowId;
				var selectRowData = this.lookupDataGrid.model.byId(selectedRowIndex);
				// set field data here 
				var invoiceNumber = selectRowData.rawData.clientId;
				var shipping =  selectRowData.rawData.clientName;
				window.batch.container.controller.getPropertyController("DC_Page","Invoice_Number").set("value",invoiceNumber);
				window.batch.container.controller.getPropertyController("DC_Page","Shipping").set("value",shipping);
				_this.hide();
			}));
			this.lookupDataGrid.startup();
			this.lookupDataGrid.resize();
		}
		
	});
});