package org.dhs.filters;

import com.ibm.ecm.extension.PluginLogger;
import com.ibm.ecm.extension.PluginRequestFilter;
import com.ibm.ecm.extension.PluginRequestUtil;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArtifact;
import com.ibm.json.java.JSONObject;
import org.dhs.util.Util;

import javax.servlet.http.HttpServletRequest;

public  class RequestFilter extends PluginRequestFilter {

	public String[] getFilteredServices() {
		return new String[] { "/pluginRepository" };
	}

	
	public  JSONObject filter(PluginServiceCallbacks callbacks, HttpServletRequest request, JSONArtifact jsonRequest) throws Exception {
		String methodName = "filter";
		PluginLogger logger  = callbacks.getLogger();
		if(logger.isDebugLogged())
			logger.logInfo(RequestFilter.class,methodName,"Entry");
		Util util = new Util(callbacks.getLogger());
		String loginUser = callbacks.getUserId();
		logger.logInfo(RequestFilter.class, methodName, "Login User is "+loginUser);
		JSONObject ignoresJson  = util.getConfigurationKeys(callbacks);
		logger.logInfo(RequestFilter.class, methodName, "Ignore Json "+ignoresJson);
		boolean canIgnoreFilter = false;
		if(ignoresJson != null) {
			String ignores = (String) ignoresJson.get("IgnoreAdmins");
			String ignoresList [] = ignores.split(",");
			for(int x = 0 ; x < ignoresList.length ; x++) {
				if(loginUser.toLowerCase().contains(ignoresList[x].toLowerCase())) { // meaning admin
					canIgnoreFilter = true;
					break;
				}
			}
		}
		System.out.println(" canIgnoreFilter :"+canIgnoreFilter);
		if(canIgnoreFilter) 
			return null;
		String logicalName = "PB_SCANUSER==|"+loginUser;
		String logicalName1  = "QS_OP==|"+loginUser;
		String apiReq  = request.getParameter("api");
		logger.logInfo(RequestFilter.class, methodName, "apiReq  "+apiReq);
		if(apiReq != null && apiReq.contains("Queue/GetBatchList")) {
			PluginRequestUtil.setRequestParameter(request, "api", apiReq +"&"+logicalName);
		}
		return null;
	}
	
}
