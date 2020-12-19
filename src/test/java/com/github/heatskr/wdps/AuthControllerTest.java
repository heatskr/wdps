package com.github.heatskr.wdps;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
// import org.junit.Test;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class AuthControllerTest {

	@Autowired
	private TestRestTemplate template;

	@Test
	public void givenRequestOnPrivateService_shouldFailWith403() throws Exception {
		ResponseEntity<String> result = template.getForEntity("/api", String.class);
		assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
	}

	@Test
	public void givenAuthRequestOnPrivateService_shouldSucceedWith200() throws Exception {
		JSONObject body = new JSONObject();
		body.put("username", "bob");
		body.put("password", "test123");

		HttpEntity<String> request;
		ResponseEntity<String> response;
		JSONObject result;

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		request = new HttpEntity<String>(body.toString(), headers);
		response = template.postForEntity("/login", request, String.class);
		assertEquals(response.getStatusCode(), HttpStatus.OK);

		result = new JSONObject(response.getBody());
		assertEquals(result.getString("username"), "bob");

		String token = result.getString("token");
		headers.setBearerAuth(token);

		request = new HttpEntity<String>(headers);
		response = template.exchange("/api/document", HttpMethod.GET, request, String.class, 1);
		assertEquals(response.getStatusCode(), HttpStatus.OK);
		result = new JSONObject(response.getBody());
		assertEquals(result.getJSONObject("_embedded") == null, false);
	}
};
