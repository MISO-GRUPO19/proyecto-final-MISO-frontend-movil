package com.getcapacitor.myapp;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
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

import java.util.Random;


@RunWith(AndroidJUnit4.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class FeatureHU13 {
  private static final long LAUNCH_TIMEOUT = 10000L;
  private static final String BASIC_SAMPLE_PACKAGE = "com.miempresa.miapp";

  private UiDevice device;

  private static Faker faker;
  private static String fakeEmail;

  @BeforeClass
  public static void setUpClass(){
    faker = new Faker();
    fakeEmail = faker.internet().emailAddress();
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
  public void test1_registerClientSuccessful (){
    //UiSelector registerButton = new UiSelector().resourceId("com.yourapp.package:id/register-button");
    UiObject2 registerLink = device.wait(Until.findObject(By.text("Regístrate")), 5000);
    registerLink.click();

    SystemClock.sleep(1000);
    UiObject2 emailInput = device.wait(Until.findObject(By.hint("Email")), 5000);
    emailInput.setText(fakeEmail);
    String fakePassword = String.format("%s$%s",faker.name().firstName(), faker.number().digits(4));
    UiObject2 passwordInput = device.wait(Until.findObject(By.hint("Contraseña nueva")), 5000);
    passwordInput.setText(fakePassword);
    UiObject2 passwordInputConfirmed = device.wait(Until.findObject(By.hint("Confirme contraseña")), 5000);
    passwordInputConfirmed.setText(fakePassword);
    //UiObject2 registerButton = device.findObject(By.res("register-button"));
    UiObject2 registerButton = device.wait(Until.findObject(By.text("Registrarme")), 5000);
    SystemClock.sleep(1000);
    registerButton.click();
    SystemClock.sleep(1000);
    UiObject2 nameInput = device.wait(Until.findObject(By.hint("Nombre")), 5000);
    String fakeName = faker.name().firstName();
    nameInput.setText("Juan");
    UiObject2 lastNameInput = device.wait(Until.findObject(By.hint("Apellido")), 5000);
    String fakeLastName = faker.name().lastName();
    lastNameInput.setText("Villada");
    UiObject2 phoneInput = device.wait(Until.findObject(By.hint("Número de teléfono")), 5000);
    String fakePhone = String.format("+%s",faker.number().numberBetween(8, 14));
    phoneInput.setText("7777777");
    UiObject2 addressInput = device.wait(Until.findObject(By.hint("Dirección principal")), 5000);
    String fakeAddress = faker.name().fullName();
    addressInput.setText("aaaaaaaaaaa");
    UiObject2 country = device.wait(Until.findObject(By.text("País")), 10000);
    country.click();
    SystemClock.sleep(1000);
    String [] countries = {"Colombia", "México", "Argentina", "España"};
    Random rand = new Random();
    int randomInt = rand.nextInt(4);

    device.wait(Until.findObject(By.text(countries[randomInt])), 5000).click();

    SystemClock.sleep(3000);
    UiObject2 saveButton = device.wait(Until.findObject(By.text("Guardar")), 5000);
    saveButton.click();
    SystemClock.sleep(1000);
    boolean textResult = device.wait(Until.hasObject(By.text("Registro exitoso")), 5000);
    Assert.assertTrue(textResult);
  }

  @Test
  public void test2_passwordMissmatch(){
    device.wait(Until.findObject(By.text("Regístrate")), 5000).click();
    SystemClock.sleep(1000);
    device.wait(Until.findObject(By.hint("Email")), 5000).setText(faker.internet().emailAddress());
    device.wait(Until.findObject(By.hint("Contraseña nueva")), 5000).setText(faker.internet().password());
    device.wait(Until.findObject(By.hint("Confirme contraseña")), 5000).setText(faker.internet().password());
    SystemClock.sleep(1000);
    device.wait(Until.findObject(By.text("Registrarme")), 5000).click();
    SystemClock.sleep(1000);
    boolean textResult = device.wait(Until.hasObject(By.text("Confirmación de contraseña no coincide")), 5000);
    Assert.assertTrue(textResult);
  }
  @Test
  public void test3_existingEmail(){
    device.wait(Until.findObject(By.text("Regístrate")), 5000).click();
    SystemClock.sleep(1000);
    device.wait(Until.findObject(By.hint("Email")), 5000).setText(fakeEmail);
    String password = String.format("%s$%s",faker.name().firstName(),faker.number().digits(4));
    device.wait(Until.findObject(By.hint("Contraseña nueva")), 5000).setText(password);
    device.wait(Until.findObject(By.hint("Confirme contraseña")), 5000).setText(password);
    SystemClock.sleep(1000);
    device.wait(Until.findObject(By.text("Registrarme")), 5000).click();
    SystemClock.sleep(1000);
    boolean textResult = device.wait(Until.hasObject(By.text("Usuario ya existe")), 5000);
    Assert.assertTrue(textResult);
  }
}
