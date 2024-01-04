package org.dhs;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.*;
import com.ibm.ecm.extension.PluginFeature;
import com.ibm.ecm.extension.PluginLayout;
import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuType;
import com.ibm.ecm.extension.PluginODAuthenticationService;
import com.ibm.ecm.extension.PluginOpenAction;
import com.ibm.ecm.extension.PluginRequestFilter;
import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.extension.PluginViewerDef;

import org.dhs.filters.RequestFilter;
import org.dhs.services.LookupIncomeMaintenance;

public class DHSPlugin extends Plugin {


	public void applicationInit(HttpServletRequest request,
								PluginServiceCallbacks callbacks) throws Exception {
	}


	public String getId() {
		return "DHSPlugin";
	}


	public String getName(Locale locale) {
		return "DHS Plugin";
	}


	public String getVersion() {
		return "1.0.15"; // has tab changes
	}


	public String getCopyright() {
		return "Optionally add a CopyRight statement here";
	}

	public String getScript() {
		return "DHSPlugin.js";
	}


	public String getDebugScript() {
		return getScript();
	}

	public String getDojoModule() {
		return "dHSPluginDojo";
	}

	public String getCSSFileName() {
		return "DHSPlugin.css";
	}

	public String getDebugCSSFileName() {
		return getCSSFileName();
	}

	public PluginOpenAction[] getOpenActions() {
		return new PluginOpenAction[0];
	}


	public PluginRequestFilter[] getRequestFilters() {
		return new PluginRequestFilter[] { new RequestFilter()};
	}


	public PluginResponseFilter[] getResponseFilters() {
		return new PluginResponseFilter[0];
	}


	public PluginODAuthenticationService getODAuthenticationService() {
		return null;
	}

	public String getConfigurationDijitClass() {
		return "dHSPluginDojo.ConfigurationPane";
	}

	public PluginViewerDef[] getViewers() {
		return new PluginViewerDef[0];
	}

	public PluginLayout[] getLayouts() {
		return new PluginLayout[0];
	}

	public PluginFeature[] getFeatures() {
		return new PluginFeature[0];
	}


	public PluginMenuType[] getMenuTypes() {
		return new PluginMenuType[0];
	}

	public PluginMenu[] getMenus() {
		return new PluginMenu[0];
	}

	public com.ibm.ecm.extension.PluginAction[] getActions() {
		return new com.ibm.ecm.extension.PluginAction[]{new org.dhs.actions.PrefillAction()};
	}

	public com.ibm.ecm.extension.PluginService[] getServices() {
		return new com.ibm.ecm.extension.PluginService[]{new org.dhs.services.LookupService(), new org.dhs.services.LookupCaregiver(), new org.dhs.services.LookupServiceId(), new org.dhs.services.LookupClient() , new LookupIncomeMaintenance()};
	}

}
