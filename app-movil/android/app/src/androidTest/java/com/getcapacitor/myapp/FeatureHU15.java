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
import org.json.JSONArray;

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
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class FeatureHU15 {
  private static final long LAUNCH_TIMEOUT = 10000L;
  private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";
  private UiDevice device;
  private static Faker faker = new Faker();

  @Before
  public void startApp() {
    // Initialize UiDevice instance
    device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

    // Press home button
    device.pressHome();

    // Wait for launcher
    String launcherPackage = device.getLauncherPackageName();
    assertThat(launcherPackage, notNullValue());
    device.wait(Until.hasObject(By.pkg(launcherPackage).depth(0)), LAUNCH_TIMEOUT);

    // Launch the app
    Context context = ApplicationProvider.getApplicationContext();
    Intent intent = context.getPackageManager().getLaunchIntentForPackage(BASIC_SAMPLE_PACKAGE);
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
      context.startActivity(intent);
    }
    device.wait(Until.hasObject(By.pkg(BASIC_SAMPLE_PACKAGE).depth(0)), LAUNCH_TIMEOUT);
  }

  @Test
  public void test1_verifyOrderCreation(){
    device.wait(Until.findObject(By.hint("Email")), 5000).setText("cliente1@ccp.com");
    device.wait(Until.findObject(By.hint("Contraseña")), 5000).setText("Cliente*1234");
    SystemClock.sleep(2000);
    device.wait(Until.findObject(By.text("Iniciar sesión")), 5000).click();
    SystemClock.sleep(1000);
    String clientId = "bf68a5ba-c1c4-47fc-b80f-0bb9e9fe98ac";
    String accessToken = "";
    try {
      URL createClientUrl = new URL("http://10.0.2.2:8080/orders/" + clientId );
      HttpURLConnection conn = (HttpURLConnection) createClientUrl.openConnection();

      conn.setRequestMethod("GET");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + accessToken);

      int responseCode = conn.getResponseCode();
      if (responseCode == HttpURLConnection.HTTP_OK) {
        BufferedReader in = new BufferedReader(
          new InputStreamReader(conn.getInputStream())
        );
        String inputLine;
        StringBuilder response = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
          response.append(inputLine);
        }
        in.close();
        System.out.println("Response: " + response.toString());
        JSONArray customers = new JSONArray(response.toString());
        JSONObject firstCustomer = customers.getJSONObject(0);
        String customerId = firstCustomer.getString("client_id");

        Assert.assertEquals(customerId, clientId);


      } else {
        System.out.println("GET request failed. Response Code: " + responseCode);
      }

      conn.disconnect();

    } catch (IOException | JSONException e) {
      throw new RuntimeException(e);
    }

  }
}
