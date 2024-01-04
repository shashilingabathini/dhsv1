package org.dhs.services;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResultSetResponse;
import com.ibm.json.java.JSONObject;


public class LookupService  extends PluginService {

	public String getId() {
		return "LookupService";
	}

	public String getOverriddenService() {
		return null;
	}

	public void execute(PluginServiceCallbacks callbacks,
						HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		JSONResultSetResponse jsonResults = new JSONResultSetResponse();
		try {
			String json = "{\r\n\t\"columns\": [\r\n\t\t{\r\n\t\t\t\"displayName\": \"Client Id\",\r\n\t\t\t\"value\": \"clientId\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"displayName\": \"Client Name\",\r\n\t\t\t\"value\": \"clientName\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"displayName\": \"DOB\",\r\n\t\t\t\"value\": \"dob\"\r\n\t\t}\r\n\t],\r\n\t\"rows\": [\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t},\r\n\t\t{\r\n\t\t\t\"clientId\": \"0000897\",\r\n\t\t\t\"clientName\": \"Client 0000897\",\r\n\t\t\t\"dob\": \"00-00-9999\"\r\n\t\t}\r\n\t]\r\n}";
			JSONObject resultsJson = JSONObject.parse(json);
			jsonResults.put("results", resultsJson);
			jsonResults.put("error", null);
			jsonResults.put("status", "success");
		} catch (Exception e) {
			String errorMessage = e.getLocalizedMessage();
			jsonResults.put("status", "failed");
			jsonResults.put("error", errorMessage);
			jsonResults.put("errorCode", "ERR_GET_LOOKUP_DETAILS");

		}
		PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "LookupService");
	}
}
