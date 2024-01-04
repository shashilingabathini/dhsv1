define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"ecm/widget/dialog/BaseDialog",
	"dojo/text!./templates/DCAddPropertiesDialog.html",
	"datacapweb/model/Messages",
	"dijit/form/Textarea",
	"ecm/widget/DatePicker",
	"ecm/widget/Select"
],

function(declare, lang, aspect,BaseDialog, template,Messages) {

	return declare("dHSPluginDojo.widget.dialog.DCAddPropertiesDialog", [BaseDialog], {
		contentString: template,
		_messages: Messages,
		onPropertiesSet: null,
		postCreate: function() {
			var methodName = "postCreate";
			this.logEntry(methodName);
			this.inherited(arguments);
			
			if (!this.title) {
				this.setTitle('Add propertiess');
			}
			this.setSize(430,532); 
			this.saveButton = this.addButton(this._messages.save_button, "_save", true, true);
			this.logExit(methodName);
		},
		setPageInfo:function(batch,pageId){
			this._batch=batch;
			this._page=this._batch.getChildById(pageId,true);
			var pageType=this._page.getVariable("TYPE");
			this.setIntroText("Add properties to "+pageId+" "+pageType);
			var documentType=this._page.getVariable("DOCUMENT_TYPE");
			if(documentType)
				this.documentType.setValue(documentType);
			else 
				this.documentType.setValue(documentType);	
					
			//var documentClass=this._page.getVariable("DOCUMENT_CLASS");
			//if(documentClass)
			//	this.documentClass.setValue(documentClass);
			//else {
				var _className = this.getDocumentClassValue()
				console.log(_className)
				this.documentClass.setValue(_className);
			//}
			
			var documentDesc=this._page.getVariable("DOCUMENT_DESC");
			if(documentDesc)
				this.documentDesc.setValue(documentDesc);
			else
				this.documentDesc.setValue("");
					
			
			var documentDate=this._page.getVariable("DOCUMENT_DATE");
			if(documentDate)
				this.documentDate.setValue(documentDate);
			else
				this.documentDate.setValue(new Date());		
				
			var formNumber=this._page.getVariable("FORM_NUM");
			if(formNumber)
				this.formNumber.setValue(formNumber);
			else
				this.formNumber.setValue("");	
				
			var containsFTI=this._page.getVariable("CONTAINS_FTI");
			if(containsFTI)
				this.containsFTI.setValue(containsFTI);
			else
				this.containsFTI.setValue("");						
		},
		show : function() {	
				this.saveButton.set("disabled", true);
				this.inherited("show", []);	
		},
		
		_save: function() {			
			this.saveButton.set("disabled", true);
			var documentType=this.documentType.getValue();
			this._page.setVariable("DOCUMENT_TYPE",documentType);
			
			var documentClass=this.documentClass.getValue();
			this._page.setVariable("DOCUMENT_CLASS",documentClass);
			
			var documentDesc=this.documentDesc.getValue();
			this._page.setVariable("DOCUMENT_DESC",documentDesc);
			
			var documentDate=this.documentDate.getValue();
			this._page.setVariable("DOCUMENT_DATE",documentDate);
			
			var formNumber=this.formNumber.getValue();
			this._page.setVariable("FORM_NUM",formNumber);
			
			var containsFTI=this.containsFTI.getValue();
			this._page.setVariable("CONTAINS_FTI",containsFTI);
			
			this.hide();
		},
		
		_onChange : function() {
			this.saveButton.set("disabled", false);
		},
		
		onCancel: function() {
			this.logEntry("onCancel");
			this.hide();
			this.logExit("onCancel");
		},
		getDocumentClassValue : function() {
			var contentType =  window.batch.container.controller.collections.DC_Page.model.properties.Content_Type.value;
			var documentClass = null;	
			console.log('contentType :'+contentType)
			if(contentType != undefined) {
				switch(contentType) {
					case  "Income Maintenance" :
							documentClass = "Benefits Documentation";
							break;
							
					case  "CCL - Caregiver Clearance Docs" :
							documentClass = "Caregiver Documentation";
							break;	
							
					case  "CCL – Care Giver Docs" :
							documentClass = "Caregiver Documentation";
							break;
							
					case  "CCL - Service Docs" :
							documentClass = "Service Documentation";
							break;	

					case  "Client - CCS" :
							documentClass = "Child Case Subsidy Document";
							break;	
							
					case  "Client - E&T" :
							documentClass = "Employment & Training Document";
							break;	
							
					case  "Client - FTW" :
							documentClass = "First-to-Work Documentation";
							break;	
							
					case  "Client - POD" :
							documentClass = "Preschool Open Doors Document";
							break;	
					
					case  "Contracts" :
							documentClass = "Contract Document";
							break;
							
					case  "Client - NA" :
							documentClass = "NA Document";
							break;	
							
					default :
							documentClass = "";
							break;
				}
			}
			return documentClass;
		}
	});

});
