package com.getcapacitor.myapp;


import org.json.JSONException;
import org.json.JSONObject;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import com.github.javafaker.Faker;
import androidx.test.core.app.ApplicationProvider;


import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.*;
import androidx.test.uiautomator.UiSelector;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Random;
@RunWith(AndroidJUnit4.class)
public class FeatureHU31 {
  private static final long LAUNCH_TIMEOUT = 10000L;
  private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";
  private UiDevice device;
  private static Faker faker = new Faker();
  private static String fakeFirstName;
  private static String fakeLastName;
  private static final String [] countries = {"Argentina", "Colombia", "Chile", "Brasil", "Ecuador"};
  private static String fakeAddress;
  private static String fakePhone;
  private static String fakeEmail;
  private static Integer fakeInt = faker.number().numberBetween(0,4);
  private static String choosenCountry = countries[fakeInt];

  @BeforeClass
  public static void setUpClass() throws ProtocolException {

    String accessToken = "";
    fakeFirstName = faker.name().firstName();
    fakeLastName = faker.name().lastName();
    fakeAddress = faker.address().streetAddress();
    fakePhone = faker.number().digits(8);
    fakeEmail = faker.internet().emailAddress();

    //Login
    try {
      URL loginUrl = new URL("http://10.0.2.2:8080/users/login");
      HttpURLConnection conn = (HttpURLConnection) loginUrl.openConnection();

      conn.setRequestMethod("POST");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setDoOutput(true);
      String jsonBody = "{\"email\":\"admin@ccp.com\",\"password\":\"Admin123-\"}";

      try (OutputStream os = conn.getOutputStream()) {
        byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
        os.write(input, 0, input.length);
      }

      int status = conn.getResponseCode();
      BufferedReader reader;

      if (status > 299) {
        reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
      } else {
        reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
      }

      StringBuilder response = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        response.append(line.trim());
      }
      reader.close();

      JSONObject loginResponse = new JSONObject(response.toString());
      accessToken = loginResponse.getString("access_token");
      conn.disconnect();

    } catch (IOException | JSONException e) {
        throw new RuntimeException(e);
    }
    //Create Client

    try {
      URL createClientUrl = new URL("http://10.0.2.2:8080/users/customers");
      HttpURLConnection conn = (HttpURLConnection) createClientUrl.openConnection();

      conn.setRequestMethod("POST");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + accessToken);

      conn.setDoOutput(true);

      JSONObject customerBody = new JSONObject();

      customerBody.put("firstName", fakeFirstName);
      customerBody.put("lastName", fakeLastName);
      customerBody.put("country", choosenCountry);
      customerBody.put("address", fakeAddress);
      customerBody.put("phoneNumber", fakePhone);
      customerBody.put("email", fakeEmail);
      try (OutputStream os = conn.getOutputStream()) {
        byte[] input = customerBody.toString().getBytes(StandardCharsets.UTF_8);
        os.write(input, 0, input.length);
      }
      int status = conn.getResponseCode();
      BufferedReader reader;

      if (status > 299) {
        reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
      } else {
        reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
      }

      StringBuilder response = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        response.append(line.trim());
      }
      reader.close();

      System.out.println(response);
      conn.disconnect();

    } catch (IOException | JSONException e) {
        throw new RuntimeException(e);
    }

  }
  @Before
  public void startApp() {
    // Initialize UiDevice instance
    device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

    // Press home button
    device.pressHome();

    // Wait for launcher
    String launcherPackage = device.getLauncherPackageName();
    assertThat(launcherPackage, notNullValue());
    device.wait(
      Until.hasObject(By.pkg(launcherPackage).depth(0)),
      LAUNCH_TIMEOUT
    );

    // Launch the app
    Context context = ApplicationProvider.getApplicationContext();
    Intent intent = context.getPackageManager().getLaunchIntentForPackage(BASIC_SAMPLE_PACKAGE);
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
      context.startActivity(intent);
    }

    // Wait for the app to appear
    device.wait(
      Until.hasObject(By.pkg(BASIC_SAMPLE_PACKAGE).depth(0)),
      LAUNCH_TIMEOUT
    );
  }

  @Test
  public void verifyCustomerCreation(){
    device.wait(Until.findObject(By.hint("Email")), 5000).setText("vendedor@ccp.com");
    device.wait(Until.findObject(By.hint("Contraseña")), 5000).setText("Vendedor123-");
    SystemClock.sleep(2000);
    device.wait(Until.findObject(By.text("Iniciar sesión")), 5000).click();
    SystemClock.sleep(1000);
    boolean firstNameVisible = device.wait(Until.hasObject(By.hint(fakeFirstName)), 5000);
    /*
    UiObject2 firstNameVisible = device.wait(Until.findObject(By.hint(fakeFirstName)), 5000);
    boolean isFirstNameVisible = firstNameVisible != null;

    boolean firstNameVisible = device.wait(Until.findObject(By.hint(fakeFirstName)), 5000);
    boolean lastNameVisible = device.wait(Until.findObject(By.hint(fakeLastName)), 5000);
    boolean adressVisible = device.wait(Until.findObject(By.hint(fakeAddress)), 5000);
    boolean emailVisible = device.wait(Until.findObject(By.hint(fakeEmail)), 5000);
    boolean phoneVisible = device.wait(Until.findObject(By.hint(fakePhone)), 5000);
    boolean countryVisible = device.wait(Until.findObject(By.hint(choosenCountry)), 5000);

    Assert.assertTrue(firstNameVisible);
    Assert.assertTrue(lastNameVisible);
    Assert.assertTrue(adressVisible);
    Assert.assertTrue(emailVisible);
    Assert.assertTrue(phoneVisible);
    Assert.assertTrue(countryVisible);
    */
    Assert.assertTrue(firstNameVisible);
  }

}
