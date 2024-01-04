package org.dhs.services;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.ecm.extension.PluginLogger;
import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResultSetResponse;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import org.dhs.util.Configuration;
import org.dhs.util.Util;


public class LookupClient  extends PluginService {

	private String COLUMNS = "[ { \"displayName\": \"Client Id\", \"value\": \"clientNumber\" }, { \"displayName\": \"First Name\", \"value\": \"firstName\" }, { \"displayName\": \"Last Name\", \"value\": \"lastName\" } , { \"displayName\": \"Gender\", \"value\": \"gender\" },{ \"displayName\": \"SSN\", \"value\": \"ssn\" }, { \"displayName\": \"DOB\", \"value\": \"dateOfBirth\" }]";

	public String getId() {
		return "LookupClient";
	}


	public String getOverriddenService() {
		return null;
	}


	public void execute(PluginServiceCallbacks callbacks,
						HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String methodName = "execute - LookupClient  - service";
		JSONResultSetResponse jsonResults = new JSONResultSetResponse();
		try {
			PluginLogger logger =  callbacks.getLogger();
			if(logger.isDebugLogged()) {
				logger.logEntry(request,methodName); // prints my request object and method name
			}
			JSONObject responseJson = new JSONObject();
			boolean isLocal  = Boolean.parseBoolean(Configuration.getConfigProp("org.dhs.api.islocal"));
			JSONObject  json = null;
			System.out.println(isLocal);
			if(isLocal) {
				String staticInfo = "{ \"clients\": [{ \"clientNumber\": \"19506\", \"ssn\": \"\", \"lastName\": \"\", \"firstName\": \"\", \"dateOfBirth\": \"\", \"gender\": \"\" }] }";
				json = JSONObject.parse(staticInfo);
			} else {
				Util util =  new Util(logger);
				JSONObject body = new JSONObject();
				System.out.println(body);
				body.put("clientNumber",request.getParameter("clientNumber"));
				body.put("lastName",request.getParameter("lastName"));
				body.put("ssn",request.getParameter("ssn"));
				body.put("dateOfBirth",request.getParameter("dateOfBirth"));
				body.put("gender",request.getParameter("gender"));
				body.put("firstName",request.getParameter("firstName"));
				logger.logInfo(LookupClient.class,methodName,body.toString());
				System.out.println(body);
				String clientConfigURL = (String)((JSONObject)util.getConfigurationKeys(callbacks)).get("ClientSearchURL");
				logger.logInfo(LookupClient.class, methodName, clientConfigURL);
				System.out.println("clientConfigURL :"+clientConfigURL);
				logger.logInfo(LookupCaregiver.class,methodName,clientConfigURL);
				if(clientConfigURL == null) {
					clientConfigURL =  Configuration.getConfigProp("org.dhs.api.endpoint.client.url");
				}
				json = util.executeAPI(clientConfigURL,"POST",body,false);
				logger.logInfo(LookupClient.class,methodName,json.toString());
			}
			System.out.println(json);
			JSONArray servicesArray = (JSONArray) json.get("clients");
			JSONArray columns = JSONArray.parse(COLUMNS);
			responseJson.put("columns", columns);
			responseJson.put("rows",servicesArray);
			jsonResults.put("results", responseJson);
			jsonResults.put("error", null);
			jsonResults.put("status", "success");
			System.out.println(jsonResults);
		} catch (Exception e) {
			String errorMessage = e.getLocalizedMessage();
			jsonResults.put("status", "failed");
			jsonResults.put("error", errorMessage);
			jsonResults.put("errorCode", "ERR_GET_CLIENT_DETAILS");
		}
		PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "LookupClient");

	}

}
