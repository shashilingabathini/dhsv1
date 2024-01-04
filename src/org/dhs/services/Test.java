package org.dhs.services;

import java.io.InputStream;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;


public class Test {
	
	public static void main(String args[]) {

		try {
			JSONArray json = JSONArray.parse("[{ \"caseNumber\": 10333, \"caseStatus\": \"CL\", \"primaryIndividual\": { \"firstName\": \"TOP\", \"lastName\": \"BANANA\", \"sex\": \"F\", \"dateOfBirth\": \"1974-12-24T00:00:00-10:00\", \"clientNumber\": \"101738\", \"ssn\": \"343450540\" }, \"unitNumber\": \"180\", \"ProgramType\": \"FS\" }, { \"caseNumber\": 10333, \"caseStatus\": \"CL\", \"primaryIndividual\": { \"firstName\": \"TOP\", \"lastName\": \"BANANA\", \"sex\": \"F\", \"dateOfBirth\": \"1974-12-24T00:00:00-10:00\", \"clientNumber\": \"101738\", \"ssn\": \"343450540\" }, \"unitNumber\": \"180\", \"ProgramType\": \"AF\" }, { \"caseNumber\": 10333, \"caseStatus\": \"CL\", \"primaryIndividual\": { \"firstName\": \"TOP\", \"lastName\": \"BANANA\", \"sex\": \"F\", \"dateOfBirth\": \"1974-12-24T00:00:00-10:00\", \"clientNumber\": \"101738\", \"ssn\": \"343450540\" }, \"unitNumber\": \"180\", \"ProgramType\": \"AF\" }]");
			JSONArray servicesArray = new JSONArray();
			for(int x = 0; x < json.size() ; x++) {
				JSONObject jsonObject  =  (JSONObject) json.get(x);
				servicesArray.add((JSONObject) jsonObject.get("primaryIndividual"));
			}
			System.out.println(servicesArray);	
			String COLUMNS = "[ { \"displayName\": \"Client Number\", \"value\": \"clientNumber\" }, { \"displayName\": \"DOB\", \"value\": \"dateOfBirth\" }, { \"displayName\": \"First Name\", \"value\": \"firstName\" } , { \"displayName\": \"Last Name\", \"value\": \"lastName\" },{ \"displayName\": \"Sex\", \"value\": \"sex\" },{ \"displayName\": \"SSN\", \"value\": \"ssn\" },{ \"displayName\": \"Case Number\", \"value\": \"caseNumber\" }]";
			JSONArray columns = JSONArray.parse(COLUMNS);
			System.out.println(columns);
				
		} catch (Exception e) {
			e.printStackTrace();
		
		}
	}
}
