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
	"dojo/text!./templates/ClientDialog.html",
	"gridx/core/model/cache/Sync",
	"gridx/modules/ColumnResizer"

],function(declare,BaseDialog,TextBox,DatePicker,Select,Button,Grid,ItemFileWriteStore,Request,lang,connect,domStyle,MessageDialog,template){
	return declare("dHSPluginDojo.widget.dialog.ClientDialog",[BaseDialog],{

		contentString: template,
		widgetsInTemplate: true,
        postCreate : function() {
			this.inherited(arguments);
			this.setTitle("Client Search");
			this.setExpandable(false);
			this._setEmptyGrid();
			this.setSize(600,650);
			//this.setMaximized(true)
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
            if(this._clientId.get("value") != "") {
                requestParams['lastName'] = "";
                requestParams['ssn'] = "";
                requestParams['dateOfBirth'] = "";
                requestParams['gender'] = "";
                requestParams['firstName'] = "";
                requestParams['clientNumber'] = this._clientId.get("value");
            } else {
                requestParams['lastName'] = this._lastName.get("value");
                requestParams['ssn'] = this._ssn.get("value");
                requestParams['dateOfBirth'] = this._dob.get("value");
                requestParams['gender'] = this._gender.get("value");
                requestParams['firstName'] =  this._firstName.get("value");
                requestParams['clientNumber'] = "";
            }
            console.dir(requestParams)
			Request.invokePluginService("DHSPlugin","LookupClient",{
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
		    if(this._lastName.get("value") === ""  && this._ssn.get("value") === "" && this._dob.get("value") === null && this._clientId.get("value") === "") {
                missedMandatory = true
            }
            return missedMandatory
		},
		_setGridStructure : function(columns) {
			var gridLayout = [];
			var colWidth = "80px";
			for(var x = 0 ; x < columns.length ; x++) {
				gridLayout.push({id:x+1,field:columns[x].value,name:columns[x].displayName,width:colWidth});
			}
			console.dir(gridLayout)
			this.lookupDataGrid.setColumns(gridLayout); 
		},
		_setGridStore : function(rows) {
			var gridData = {
					identifier: 'id',
					items: []
				};
			var _items = [];
			for(var x = 0; x
			< rows.length ; x++) {
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
				var dateOfBirth = selectRowData.rawData.dateOfBirth
                if(dateOfBirth) {
                    var _f = new Date(dateOfBirth)
                    dateOfBirth =   ((_f.getMonth() + 1 ) < 10 ? "0" + (_f.getMonth() + 1 ) : (_f.getMonth() + 1 )) + "/" + (_f.getDate() < 10 ? ("0" + _f.getDate()) : _f.getDate())+ "/" + _f.getFullYear()
                }
				window.batch.container.controller.getPropertyController("DC_Batch","Client_ID").set("value",selectRowData.rawData.clientNumber);
                window.batch.container.controller.getPropertyController("DC_Batch","Last_Name").set("value",selectRowData.rawData.lastName);
                window.batch.container.controller.getPropertyController("DC_Batch","First_Name").set("value",selectRowData.rawData.firstName);
                window.batch.container.controller.getPropertyController("DC_Batch","SSN").set("value",selectRowData.rawData.ssn);
                window.batch.container.controller.getPropertyController("DC_Batch","Date_Of_Birth").set("value",dateOfBirth);
                _this.hide();
			}));
			this.lookupDataGrid.startup();
			this.lookupDataGrid.resize();
		}
	});
});