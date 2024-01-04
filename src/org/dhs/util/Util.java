package org.dhs.util;

import com.ibm.ecm.extension.PluginLogger;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class Util {

    PluginLogger logger = null;

    public Util(PluginLogger logger) {
        this.logger = logger;
    }

    private String MIME_JSON = "application/json";

    public JSONObject executeAPI(String url, String type,JSONObject body,boolean isSecured) throws Exception {
        String methodName  = "executeAPI";
        logger.logEntry(body,methodName);
        logger.logInfo(Util.class,methodName,url + type + body + isSecured);
        System.out.println(url + type + body + isSecured);
        JSONObject response =  null;
        try {
            HttpURLConnection connection = (HttpURLConnection)  fetchURLConnection(url, isSecured);
            InputStream stream  = null;
            if(connection != null) {
                connection.setConnectTimeout(Integer.parseInt(Configuration.getConfigProp("org.dhs.api.endpoint.timeout")));
                connection.setRequestProperty("Content-Type",MIME_JSON+"; charset=UTF-8");
                connection.setRequestProperty("x-api-key",Configuration.getConfigProp("org.dhs.api.endpoint.apikey"));
                connection.setDoOutput(true);
                connection.setDoInput(true);
                connection.setRequestMethod(type);
                OutputStream os = connection.getOutputStream();
                os.write(body.toString().getBytes("UTF-8"));
                os.close();
                stream  = new BufferedInputStream(connection.getInputStream());
                try {
                    response = JSONObject.parse(stream);
                    logger.logInfo(Util.class,methodName,response.toString());
                    System.out.println(response.toString());
                } catch (Exception e) {
                    if(stream != null)
                        stream.close();
                    throw e;
                } finally {
                    if(stream != null)
                        stream.close();
                }
            }

        } catch (Exception e) {
            throw e;
        }
        return response;
    }


    public JSONArray executeAPIArray(String url, String type, JSONObject body, boolean isSecured) throws Exception {
        String methodName  = "executeAPIArray";
        logger.logEntry(body,methodName);
        logger.logInfo(Util.class,methodName,url + type + body + isSecured);
        System.out.println(url + type + body + isSecured);
        JSONArray response =  null;
        try {
            HttpURLConnection connection = (HttpURLConnection)  fetchURLConnection(url, isSecured);
            InputStream stream  = null;
            if(connection != null) {
                connection.setConnectTimeout(Integer.parseInt(Configuration.getConfigProp("org.dhs.api.endpoint.timeout")));
                connection.setRequestProperty("Content-Type",MIME_JSON+"; charset=UTF-8");
                connection.setRequestProperty("x-api-key",Configuration.getConfigProp("org.dhs.api.endpoint.apikey"));
                connection.setDoOutput(true);
                connection.setDoInput(true);
                connection.setRequestMethod(type);
                OutputStream os = connection.getOutputStream();
                os.write(body.toString().getBytes("UTF-8"));
                os.close();
                stream  = new BufferedInputStream(connection.getInputStream());
                try {
                    response = JSONArray.parse(stream);
                    logger.logInfo(Util.class,methodName,response.toString());
                    System.out.println(response.toString());
                } catch (Exception e) {
                    if(stream != null)
                        stream.close();
                    throw e;
                } finally {
                    if(stream != null)
                        stream.close();
                }
            }

        } catch (Exception e) {
            throw e;
        }
        return response;
    }

    public URLConnection fetchURLConnection(String url , boolean isSecured) throws Exception {
        String methodName = "fetchURLConnection";
        logger.logEntry(url,methodName);
        URLConnection connectionObject = null;
        if(url == null  || url.isEmpty())
            throw new Exception("Empty URL");
        if(isSecured) {
            try {
                connectionObject =  (HttpsURLConnection) new URL(url).openConnection();
            } catch (Exception e) {
                throw e;
            }
        } else {
            try {
                connectionObject =  (HttpURLConnection) new URL(url).openConnection();
            } catch (Exception e) {
                throw e;
            }
        }
        return connectionObject;
    }

    public JSONObject getConfigurationKeys(PluginServiceCallbacks callbacks) {
        String methodName = "getConfigurationKeys";
        logger.logEntry(Util.class, methodName);
        JSONObject json = null;
        try {
            json = new JSONObject();
            String configuration = callbacks.loadConfiguration();
            System.out.println("Configuration :"+configuration);
            if(configuration != null) {
                JSONObject keysObject = JSONObject.parse(configuration);
                System.out.println("KeysObject :"+keysObject);
                JSONArray keysConfig =  (JSONArray) keysObject.get("configuration");
                for(int x = 0 ; x < keysConfig.size() ; x++) {
                    JSONObject key = (JSONObject) keysConfig.get(x);
                    if(key.get("name").toString().equals("_caregiverURL")) {
                        json.put("CaregiverURL", key.get("value").toString());
                    } else if(key.get("name").toString().equals("_serviceIdURL")) {
                        json.put("ServiceIdURL",key.get("value").toString());
                    } else if(key.get("name").toString().equals("_clientSearchURL")) {
                        json.put("ClientSearchURL",key.get("value").toString());
                    } else if(key.get("name").toString().equals("_clientNumberSearchURL")) {
                        json.put("ClientNumberURL",key.get("value").toString());
                    } else if(key.get("name").toString().equals("_caseNumberSearchURL")) {
                        json.put("CaseNumberURL",key.get("value").toString());
                    } else if(key.get("name").toString().equals("_ignoreAdminUsers")) {
                        json.put("IgnoreAdmins",key.get("value").toString());
                    }
                }
            }
        } catch (Exception e) {
            logger.logError(e, methodName, methodName);
            e.printStackTrace();
        }
        return json;
    }
}
