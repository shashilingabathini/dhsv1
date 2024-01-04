package org.dhs.services;

import com.ibm.ecm.extension.PluginLogger;
import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResultSetResponse;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import org.dhs.util.Configuration;
import org.dhs.util.Util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LookupIncomeMaintenance extends PluginService {

	private String COLUMNS = "[ { \"displayName\": \"Client Number\", \"value\": \"clientNumber\" }, { \"displayName\": \"DOB\", \"value\": \"dateOfBirth\" }, { \"displayName\": \"First Name\", \"value\": \"firstName\" } , { \"displayName\": \"Last Name\", \"value\": \"lastName\" },{ \"displayName\": \"Sex\", \"value\": \"sex\" },{ \"displayName\": \"SSN\", \"value\": \"ssn\" },{ \"displayName\": \"Case Number\", \"value\": \"caseNumber\" }]";

	public String getId() {
		return "LookupIncomeMaintenance";
	}


	public String getOverriddenService() {
		return null;
	}


	public void execute(PluginServiceCallbacks callbacks,
						HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String methodName = "execute - LookupIncomeMaintenance  - service";
		JSONResultSetResponse jsonResults = new JSONResultSetResponse();
		try {
			PluginLogger logger =  callbacks.getLogger();
			if(logger.isDebugLogged()) {
				logger.logEntry(request,methodName); // prints my request object and method name
			}
			JSONObject responseJson = new JSONObject();
			boolean isLocal  = Boolean.parseBoolean(Configuration.getConfigProp("org.dhs.api.islocal"));
			JSONArray  json = null;
			System.out.println(isLocal);
			if(isLocal) {
				// no sample data implementations
			} else {
				Util util =  new Util(logger);
				JSONObject body = new JSONObject();
				System.out.println(body);
				String clientNumber = request.getParameter("clientNumber");
				String caseNumber = request.getParameter("caseNumber");
				if(clientNumber != null && !clientNumber.isEmpty()) {
					body.put("clientNumber",request.getParameter("clientNumber"));
					logger.logInfo(LookupIncomeMaintenance.class,methodName,body.toString());
					System.out.println(body);
					String clientConfigURL = (String)((JSONObject)util.getConfigurationKeys(callbacks)).get("ClientNumberURL");
					logger.logInfo(LookupIncomeMaintenance.class, methodName, clientConfigURL);
					System.out.println("ClientNumberURL :"+clientConfigURL);
					logger.logInfo(LookupIncomeMaintenance.class,methodName,clientConfigURL);
					if(clientConfigURL == null) {
						clientConfigURL =  Configuration.getConfigProp("org.dhs.api.endpoint.client.number.url");
					}
					json = util.executeAPIArray(clientConfigURL,"POST",body,false);
					logger.logInfo(LookupIncomeMaintenance.class,methodName,json.toString());
					System.out.println(json);
					JSONArray servicesArray = new JSONArray();
					for(int x = 0; x < json.size() ; x++) {
						JSONObject jsonObject  =  (JSONObject) json.get(x);
						JSONObject _jsonObject = (JSONObject) jsonObject.get("primaryIndividual");
						_jsonObject.put("caseNumber",jsonObject.get("caseNumber").toString());
						servicesArray.add(_jsonObject);
					}
					logger.logInfo(LookupIncomeMaintenance.class,methodName, servicesArray.toString());
					System.out.println(servicesArray.toString());
					JSONArray columns = JSONArray.parse(COLUMNS);
					responseJson.put("columns", columns);
					responseJson.put("rows",servicesArray);
					jsonResults.put("results", responseJson);
					jsonResults.put("error", null);
					jsonResults.put("status", "success");
				} else if(caseNumber != null && !caseNumber.isEmpty()) {
					body.put("caseNumber",request.getParameter("caseNumber"));
					logger.logInfo(LookupIncomeMaintenance.class,methodName,body.toString());
					System.out.println(body);
					String caseConfigURL = (String)((JSONObject)util.getConfigurationKeys(callbacks)).get("CaseNumberURL");
					logger.logInfo(LookupIncomeMaintenance.class, methodName, caseConfigURL);
					System.out.println("caseConfigURL :"+caseConfigURL);
					logger.logInfo(LookupIncomeMaintenance.class,methodName,caseConfigURL);
					if(caseConfigURL == null) {
						caseConfigURL =  Configuration.getConfigProp("org.dhs.api.endpoint.case.number.url");
					}
					json = util.executeAPIArray(caseConfigURL,"POST",body,false);
					logger.logInfo(LookupIncomeMaintenance.class,methodName,json.toString());
					System.out.println(json);
					JSONArray servicesArray = new JSONArray();
					for(int x = 0; x < json.size() ; x++) {
						JSONObject jsonObject  =  (JSONObject) json.get(x);
						servicesArray.add((JSONObject) jsonObject.get("primaryIndividual"));
					}
					logger.logInfo(LookupIncomeMaintenance.class,methodName, servicesArray.toString());
					System.out.println(servicesArray.toString());
					JSONArray columns = JSONArray.parse(COLUMNS);
					responseJson.put("columns", columns);
					responseJson.put("rows",servicesArray);
					jsonResults.put("results", responseJson);
					jsonResults.put("error", null);
					jsonResults.put("status", "success");
				}
			}
			System.out.println(jsonResults);
		} catch (Exception e) {
			String errorMessage = e.getLocalizedMessage();
			jsonResults.put("status", "failed");
			jsonResults.put("error", errorMessage);
			jsonResults.put("errorCode", "ERR_GET_CASE_CLIENT_ID_DETAILS");
		}
		PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "LookupIncomeMaintenance");
	}

}
