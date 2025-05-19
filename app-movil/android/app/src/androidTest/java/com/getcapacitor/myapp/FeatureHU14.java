package com.getcapacitor.myapp;
import org.json.JSONException;
import org.json.JSONObject;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiObjectNotFoundException;
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
import static org.hamcrest.CoreMatchers.startsWith;
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
import java.util.List;
import java.util.Random;
import java.util.regex.Pattern;

@RunWith(AndroidJUnit4.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class FeatureHU14 {
  private static final long LAUNCH_TIMEOUT = 10000L;
  private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";
  private UiDevice device;
  private static Faker faker = new Faker();
  private static String email = faker.internet().emailAddress();
  private static String password = String.format("%s1234",email);
  private static String [] countries = {"Argentina", "Chile", "Brasil", "Ecuador", "Colombia"};
  private static String sellerId;

  private static String accessToken;
  private static String login(){
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
    return accessToken;
  }

  private static String createManufacturer(String token){

    String sellerIdentification = faker.number().digits(9);
    String nameSeller = faker.name().firstName();
    String countrySeller = countries[faker.number().numberBetween(0, countries.length - 1)];
    String addressSeller = faker.address().streetAddress();
    String phoneSeller = faker.number().digits(9);
    String emailSeller = faker.internet().emailAddress();
    int status;
    try {
      URL createManufacturerUrl = new URL("http://10.0.2.2:8080/users/sellers");
      HttpURLConnection conn = (HttpURLConnection) createManufacturerUrl.openConnection();
      conn.setRequestMethod("POST");
      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + token);

      conn.setDoOutput(true);
      JSONObject sellerBody = new JSONObject();
      sellerBody.put("identification", sellerIdentification);
      sellerBody.put("name", nameSeller);
      sellerBody.put("country", countrySeller);
      sellerBody.put("address", addressSeller);
      sellerBody.put("telephone", phoneSeller);
      sellerBody.put("email", emailSeller);
      try (OutputStream os = conn.getOutputStream()) {
        byte[] input = sellerBody.toString().getBytes(StandardCharsets.UTF_8);
        os.write(input, 0, input.length);
      }
      status = conn.getResponseCode();
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

      System.out.println(response.toString());
      JSONObject responseJson = new JSONObject(response.toString());
      sellerId = responseJson.getString("id");
      conn.disconnect();
      Assert.assertEquals(201, status);
    } catch (IOException | JSONException e) {
      throw new RuntimeException(e);
    }

    return sellerId;
  }

  private static int createProduct(String sellerId, String token){
    String productName = faker.commerce().productName();
    String productDesc = faker.commerce().department();
    int productPrice = Integer.parseInt(faker.number().digits(3));
    String [] categories = {"Frutas y Verduras", "Carnes y Pescados", "Lácteos y Huevos", "Panadería y Repostería", "Despensa", "Bebidas", "Snacks y Dulces", "Condimentos y Especias", "Productos de Limpieza", "Productos para Bebés"};
    String category = categories[faker.number().numberBetween(0, categories.length - 1)];
    int productWeight = Integer.parseInt(faker.number().digits(2));
    String productBarcode = faker.number().digits(9);
    String productBatch = String.format("Batch%d", faker.number().numberBetween(1, 100));
    int productQuantity = faker.number().numberBetween(1, 100);
    int status;
    try {
      URL createProductUrl = new URL("http://10.0.2.2:8080/products");
      HttpURLConnection conn = (HttpURLConnection) createProductUrl.openConnection();

      conn.setRequestMethod("POST");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + accessToken);
      System.out.printf("seller_id is: %s%n", sellerId);
      conn.setDoOutput(true);
      JSONObject productBody = new JSONObject();
      productBody.put("name", productName);
      productBody.put("description", productDesc);
      productBody.put("price", productPrice);
      productBody.put("category", category);
      productBody.put("weight", productWeight);
      productBody.put("barcode", productBarcode);
      productBody.put("provider_id", String.format("%s", sellerId));
      productBody.put("batch", productBatch);
      productBody.put("best_before", "2025-12-31T23:59:59");
      productBody.put("quantity", productQuantity);
      try (OutputStream os = conn.getOutputStream()) {
        byte[] input = productBody.toString().getBytes(StandardCharsets.UTF_8);
        os.write(input, 0, input.length);
      }
      status = conn.getResponseCode();
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
    return status;
  }

  private static void createUserClient(String token){

    //Create User
    try {
      URL createUserUrl = new URL("http://10.0.2.2:8080/users");
      HttpURLConnection conn = (HttpURLConnection) createUserUrl.openConnection();

      conn.setRequestMethod("POST");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + token);

      conn.setDoOutput(true);

      JSONObject userBody = new JSONObject();
      userBody.put("email", email);
      userBody.put("password", password);
      userBody.put("confirm_password", password);
      userBody.put("role", 3);
      try (OutputStream os = conn.getOutputStream()) {
        byte[] input = userBody.toString().getBytes(StandardCharsets.UTF_8);
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
      Assert.assertEquals(201, status);

    } catch (IOException | JSONException e) {
      throw new RuntimeException(e);
    }
    //Create client
    String country = countries[faker.number().numberBetween(0, countries.length - 1)];
    try {
      URL createClientUrl = new URL("http://10.0.2.2:8080/users/customers");
      HttpURLConnection conn = (HttpURLConnection) createClientUrl.openConnection();

      conn.setRequestMethod("POST");

      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Authorization", "Bearer " + accessToken);

      conn.setDoOutput(true);

      JSONObject customerBody = new JSONObject();

      customerBody.put("firstName", faker.name().firstName());
      customerBody.put("lastName", faker.name().lastName());
      customerBody.put("country", country);
      customerBody.put("address", faker.address().streetAddress());
      customerBody.put("phoneNumber", faker.number().digits(8));
      customerBody.put("email", faker.internet().emailAddress());
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
      Assert.assertEquals(201, status);

    } catch (IOException | JSONException e) {
      throw new RuntimeException(e);
    }
  }

/*
  @BeforeClass
  public static void setUpClass() {
    accessToken = login();
    sellerId = createManufacturer(accessToken);
    int productCreation = createProduct(sellerId, accessToken);
    Assert.assertEquals(201, productCreation);
    createUserClient(accessToken);
  }
*/
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
  public void test1_createOrderClient(){
    device.wait(Until.findObject(By.hint("Email")), 5000).setText("cliente2@ccp.com");
    device.wait(Until.findObject(By.hint("Contraseña")), 5000).setText("Cliente*1234");
    SystemClock.sleep(2000);
    device.wait(Until.findObject(By.text("Iniciar sesión")), 5000).click();
    SystemClock.sleep(1000);
    List<UiObject2> allTextViews = device.findObjects(By.clazz("android.widget.TextView"));
    for (UiObject2 tv : allTextViews) {
      if (tv.getText() != null && tv.getText().trim().equals("Productos")) {
        tv.click();
        break;
      }
    }
    SystemClock.sleep(2000);
    List<UiObject2> allElements = device.findObjects(By.clickable(true));
    for (UiObject2 element : allElements) {
      if (element.getText().equals("add")) {
        element.click();
        break;
      }
    }
    SystemClock.sleep(1000);
    device.wait(Until.findObject(By.text("OK")), 5000).click();
    SystemClock.sleep(1000);
    allTextViews = device.findObjects(By.clazz("android.widget.TextView"));
    for (UiObject2 tv : allTextViews) {
      if (tv.getText() != null && tv.getText().trim().equals("Carrito")) {
        tv.click();
        break;
      }
    }
    SystemClock.sleep(2000);
    allElements = device.findObjects(By.clickable(true));
    for (UiObject2 element : allElements) {
      if (element.getText().equals("Realizar pedido")) {
        element.click();
        break;
      }
    }
    SystemClock.sleep(1000);
    boolean textFound = device.wait(Until.hasObject(By.textContains("Pedido realizado")), 5000);
    Assert.assertTrue(textFound);
  }

}
