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


public class LookupServiceId  extends PluginService {

	private String COLUMNS = "[ { \"displayName\": \"Service Id\", \"value\": \"serviceID\" }, { \"displayName\": \"Service Name\", \"value\": \"serviceName\" }, { \"displayName\": \"Service Status\", \"value\": \"status\" } , { \"displayName\": \"Provider Name\", \"value\": \"providerName\" },{ \"displayName\": \"Provider Id\", \"value\": \"providerID\" },{ \"displayName\": \"Provider TIN\", \"value\": \"providerTIN\" }]";

	public String getId() {
		return "LookupServiceId";
	}


	public String getOverriddenService() {
		return null;
	}


	public void execute(PluginServiceCallbacks callbacks,
						HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String methodName = "execute - LookupServiceId  - service";
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
				String staticInfo = "{ \"serviceSearchResponse\" : { \"service\" : [ { \"providerName\" : \"KAMAAINA KIDS\", \"serviceID\" : 299, \"serviceName\" : \"AIKAHI PRESCHOOL2\", \"status\" : \"Active\", \"providerTIN\" : \"123-12-1123\", \"providerID\" : 212054 } ] } }";
				json = JSONArray.parse(staticInfo);
			} else {
				Util util =  new Util(logger);
				JSONObject body = new JSONObject();
				System.out.println(body);
				body.put("serviceID",request.getParameter("serviceID"));
				body.put("nameSearchType",request.getParameter("nameSearchType"));
				body.put("keywords",request.getParameter("keywords"));
				body.put("serviceTypeCode",request.getParameter("serviceTypeCode"));
				body.put("tin",request.getParameter("tin"));
				logger.logInfo(LookupServiceId.class,methodName,body.toString());
				System.out.println(body);
				String serviceIdConfigURL = (String)((JSONObject)util.getConfigurationKeys(callbacks)).get("ServiceIdURL");
				logger.logInfo(LookupServiceId.class, methodName, serviceIdConfigURL);
				System.out.println("serviceIdConfigURL :"+serviceIdConfigURL);
				logger.logInfo(LookupServiceId.class,methodName,serviceIdConfigURL);
				if(serviceIdConfigURL == null) {
					serviceIdConfigURL =  Configuration.getConfigProp("org.dhs.api.endpoint.serviceid.url");
				}
				json = util.executeAPIArray(serviceIdConfigURL,"POST",body,false);
				logger.logInfo(LookupServiceId.class,methodName,json.toString());
			}
			System.out.println(json);
			//JSONObject allServices = (JSONObject) json.get("serviceSearchResponse");
			JSONArray servicesArray = json;
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
			jsonResults.put("errorCode", "ERR_GET_SERVICE_ID_DETAILS");
		}
		PluginResponseUtil.writeJSONResponse(request, response, jsonResults, callbacks, "LookupCaregiver");
	}

}
