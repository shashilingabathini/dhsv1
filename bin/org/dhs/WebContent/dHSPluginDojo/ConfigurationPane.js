define([
		"dojo/_base/declare",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"ecm/widget/admin/PluginConfigurationPane",
		"dojo/json",
		"dojo/text!./templates/ConfigurationPane.html",
		"ecm/widget/HoverHelp", // in template
		"ecm/widget/ValidationTextBox" // in template
	],
	function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, PluginConfigurationPane, dojoJson,template) {

		return declare("DHSPluginDojo.ConfigurationPane", [ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,
	
		postCreate: function() {
			this.inherited(arguments);	
		},
		load: function(callback) {
			if (this.configurationString) {
				try {
					var jsonConfig = dojoJson.parse(this.configurationString);
					this._caregiverURL.set('value',jsonConfig.configuration[0].value);
					this._serviceIdURL.set('value',jsonConfig.configuration[1].value);
					this._clientSearchURL.set('value',jsonConfig.configuration[2].value);
					this._clientNumberSearchURL.set('value',jsonConfig.configuration[3].value);
					this._caseNumberSearchURL.set('value',jsonConfig.configuration[4].value);
				} catch (e) {
					this.logError("load", "failed to load configuration: " + e.message);
				}
			}
		},
		_onFieldChange : function() {
			var configArray = [];
			var configString = {  
				name: "_caregiverURL",
				value: this._caregiverURL.get('value')
			}; 
			configArray.push(configString);
			
			configString = {  
				name: "_serviceIdURL",
				value: this._serviceIdURL.get('value')
			}; 
			configArray.push(configString);
			
			configString = {  
				name: "_clientSearchURL",
				value: this._clientSearchURL.get('value')
			}; 
			configArray.push(configString);
			
			configString = {  
				name: "_clientNumberSearchURL",
				value: this._clientNumberSearchURL.get('value')
			}; 
			configArray.push(configString);
			
			configString = {  
				name: "_caseNumberSearchURL",
				value: this._caseNumberSearchURL.get('value')
			}; 
			configArray.push(configString);
			
			var configJson = {
				"configuration" : configArray
			};
			
			this.configurationString = JSON.stringify(configJson);
			this.onSaveNeeded(true);
			
		},
		validate: function() {
			return true;
		}
	});
});
