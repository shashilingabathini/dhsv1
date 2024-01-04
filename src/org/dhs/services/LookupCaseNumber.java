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


public class LookupCaseNumber extends PluginService {

	private String COLUMNS = "[ { \"displayName\": \"CaregiverId\", \"value\": \"caregiverID\" }, { \"displayName\": \"First Name\", \"value\": \"firstName\" },{ \"displayName\": \"Last Name\", \"value\": \"lastName\" } , { \"displayName\": \"DOB\", \"value\": \"dateOfBirth\" },{ \"displayName\": \"Gender\", \"value\": \"gender\" },{ \"displayName\": \"SSN\", \"value\": \"ssn\" }]";

	public String getId() {
		return "LookupCaseNumber";
	}

	public String getOverriddenService() {
		return null;
	}

	public void execute(PluginServiceCallbacks callbacks,
						HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String methodName = "execute - LookupCaseNumber  - service";
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
				String staticInfo = "[{ \"caregiverID\": 114484, \"firstName\": \"PAMELA\", \"lastName\": \"ARBITRARIO\", \"ssn\": \"SS-9008-08\", \"gender\": \"M\", \"dateOfBirth\": \"04-10-2020\" }]";
				json = JSONArray.parse(staticInfo);
			} else {
				Util util =  new Util(logger);
				JSONObject body = new JSONObject();
				System.out.println(body);
				body.put("lastName",request.getParameter("lastName"));
				body.put("ssn",request.getParameter("ssn"));
				body.put("dateOfBirth",request.getParameter("dateOfBirth"));
				body.put("gender",request.getParameter("gender"));
				body.put("firstName",request.getParameter("firstName"));
				body.put("caregiverID",request.getParameter("caregiverID"));
				logger.logInfo(LookupCaseNumber.class,methodName,body.toString());
				System.out.println(body);
				String caseNumberConfigURL = (String)((JSONObject)util.getConfigurationKeys(callbacks)).get("CaseNumberURL");
				logger.logInfo(LookupCaseNumber.class, methodName, caseNumberConfigURL);
				System.out.println("CaseNumberURL :"+caseNumberConfigURL);
				logger.logInfo(LookupCaregiver.class,methodName,caseNumberConfigURL);
				if(caseNumberConfigURL == null) {
					caseNumberConfigURL =  Configuration.getConfigProp("org.dhs.api.endpoint.case.number.url");
				}
				json = util.executeAPIArray(caseNumberConfigURL,"POST",body,false);
				logger.logInfo(LookupCaseNumber.class,methodName,json.toString());
			}
			System.out.println(json);
			JSONArray caregiversArray =  json;
			JSONArray columns = JSONArray.parse(COLUMNS);
			responseJson.put("columns", columns);
			responseJson.put("rows",caregiversArray);
			jsonResults.put("results", responseJson);
			jsonResults.put("error", null);
			jsonResults.put("status", "success");
			System.out.println(jsonResults);
		} catch (Exception e) {
			String errorMessage = e.getLocalizedMessage();
			jsonResults.put("status", "failed");
			jsonResults.put("error", errorMessage);
			jsonResults.put("errorCode", "ERR_GET_CASE_DETAILS");
		}
		PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "LookupCaseNumber");
	}

}
