package org.dhs.actions;

import java.util.Locale;
import com.ibm.ecm.extension.PluginAction;
import com.ibm.json.java.JSONObject;


public class PrefillAction extends PluginAction {


	public String getId() {
		return "PrefillAction";
	}


	public String getName(Locale locale) {
		return "Prefill";
	}

	public String getIcon() {
		return "";
	}


	public String getPrivilege() {
		return "";
	}


	public boolean isMultiDoc() {
		return false;
	}


	public boolean isGlobal() {
		return true;
	}

	public String getActionFunction() {
		return "prefillAction";
	}

	public String getServerTypes() {
		return "";
	}

	public String[] getMenuTypes() {
		return new String[0];
	}

	public JSONObject getAdditionalConfiguration(Locale locale) {
		return new JSONObject();
	}


	public String getActionModelClass() {
		return "";
	}

}
