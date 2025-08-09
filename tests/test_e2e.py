
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestProductFlow(unittest.TestCase):

    def setUp(self):
        options = Options()
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost:3000/login")

    def test_full_product_flow(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        # LOGIN
        driver.find_element(By.NAME, "username").send_keys("admin")
        driver.find_element(By.NAME, "password").send_keys("adminpass" + Keys.RETURN)
        wait.until(EC.url_contains("/products"))

        # ADD PRODUCT
        driver.get("http://localhost:3000/products")
        wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "new-product-btn"))).click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        modal.find_element(By.NAME, "name").send_keys("Selenium Product")
        modal.find_element(By.NAME, "description").send_keys("Test Description")
        modal.find_element(By.NAME, "category").send_keys("Test Category")
        modal.find_element(By.NAME, "item_code").send_keys("SEL-001")
        modal.find_element(By.NAME, "price").send_keys("99.99")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(lambda d: any("SEL-001" in r.text for r in d.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")))

        # EDIT PRODUCT
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "SEL-001" in r.text), None)
        self.assertIsNotNone(row, "Product SEL-001 not found after creation")
        row.find_element(By.CLASS_NAME, "edit-btn").click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        name_input = modal.find_element(By.NAME, "name")
        name_input.clear()
        name_input.send_keys("Selenium Product Updated")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(lambda d: "Selenium Product Updated" in d.page_source)

        # ADD STOCK MOVEMENT
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "SEL-001" in r.text), None)
        self.assertIsNotNone(row, "Product SEL-001 not found before stock movement")
        row.find_element(By.CLASS_NAME, "entry-btn").click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        modal.find_element(By.NAME, "quantity").send_keys("5")
        modal.find_element(By.CSS_SELECTOR, 'input[name="movement_type"][value="IN"]').click()
        modal.find_element(By.NAME, "note").send_keys("Automated test stock in")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(EC.alert_is_present()).accept()
        wait.until(lambda d: "SEL-001" in d.page_source)

        # DELETE PRODUCT
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "SEL-001" in r.text), None)
        self.assertIsNotNone(row, "Product SEL-001 not found before deletion")
        row.find_element(By.CLASS_NAME, "delete-btn").click()
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Delete']"))).click()
        wait.until(EC.alert_is_present()).accept()
        wait.until(lambda d: "SEL-001" not in d.page_source)

    def tearDown(self):
        self.driver.quit()


class TestStockMovementFlow(unittest.TestCase):

    def setUp(self):
        options = Options()
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost:3000/login")

    def test_stock_movement_flow(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        # LOGIN
        driver.find_element(By.NAME, "username").send_keys("admin")
        driver.find_element(By.NAME, "password").send_keys("adminpass" + Keys.RETURN)
        wait.until(EC.url_contains("/products"))

        # ADD PRODUCT 
        driver.get("http://localhost:3000/products")
        wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "new-product-btn"))).click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        modal.find_element(By.NAME, "name").send_keys("Stock Test Stock")
        modal.find_element(By.NAME, "description").send_keys("Product for stock testing")
        modal.find_element(By.NAME, "category").send_keys("StockTest")
        modal.find_element(By.NAME, "item_code").send_keys("STK-002")
        modal.find_element(By.NAME, "price").send_keys("10.00")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(lambda d: any("STK-002" in r.text for r in d.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")))

        # ADD STOCK MOVEMENT (IN)
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "STK-002" in r.text), None)
        self.assertIsNotNone(row, "Product STK-002 not found for stock movement")
        row.find_element(By.CLASS_NAME, "entry-btn").click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        modal.find_element(By.NAME, "quantity").send_keys("10")
        modal.find_element(By.CSS_SELECTOR, 'input[name="movement_type"][value="IN"]').click()
        modal.find_element(By.NAME, "note").send_keys("Stock IN Test")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(EC.alert_is_present()).accept()
        
        # ADD STOCK MOVEMENT (OUT with 0 in stock) 
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "STK-002" in r.text), None)
        self.assertIsNotNone(row, "Product STK-002 not found for stock movement")
        row.find_element(By.CLASS_NAME, "entry-btn").click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))
        modal.find_element(By.NAME, "quantity").send_keys("20")
        modal.find_element(By.CSS_SELECTOR, 'input[name="movement_type"][value="OUT"]').click()
        modal.find_element(By.NAME, "note").send_keys("Stock OUT Test")
        modal.find_element(By.XPATH, "//button[text()='Salvar']").click()
        wait.until(EC.alert_is_present())

        alert = driver.switch_to.alert
        expected_message = "Not enough stock to perform this movement."
        assert expected_message in alert.text, f"Unexpected alert: {alert.text}"
        alert.accept()

        # DELETE STOCK MOVEMENT 
        driver.get("http://localhost:3000/entries")
        wait.until(lambda d: "STK-002" in d.page_source)
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "STK-002" in r.text), None)
        self.assertIsNotNone(row, "Stock movement for STK-002 not found")
        row.find_element(By.CLASS_NAME, "delete-btn").click()
        modal = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "modal")))

        delete_button = WebDriverWait(modal, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "delete-button"))
        )
        delete_button.click()
        wait.until(EC.alert_is_present()).accept()
        wait.until(lambda d: "STK-002" not in d.page_source)

        # Delete product
        driver.get("http://localhost:3000/products")
        wait.until(lambda d: "STK-002" in d.page_source)
        rows = driver.find_elements(By.CSS_SELECTOR, ".products-table tbody tr")
        row = next((r for r in rows if "STK-002" in r.text), None)
        self.assertIsNotNone(row, "STK-002 product not found for cleanup")
        row.find_element(By.CLASS_NAME, "delete-btn").click()
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Delete']"))).click()
        wait.until(EC.alert_is_present()).accept()
        wait.until(lambda d: "STK-002" not in d.page_source)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
