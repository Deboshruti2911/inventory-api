# Inventory Management Tool - API Test Script

# This Python script is provided to test your Inventory Management Tool.
# Requirements: Python 3.6+ and `requests` library.
# Run: `pip install requests` then `python test_api.py`

import requests
import time

BASE_URL = "http://localhost:5000"  # Change this to your API base URL

def print_result(test_name, passed, expected=None, got=None, request_data=None, response_body=None):
    if passed:
        print(f"{test_name}: PASSED")
    else:
        print(f"{test_name}: FAILED")
        if request_data:
            print(f"  Request: {request_data}")
        if expected is not None and got is not None:
            print(f"  Expected: {expected}, Got: {got}")
        if response_body:
            print(f"  Response Body: {response_body}")

def test_register_user():
    payload = {"username": "ayesha roy", "password": "123456767"}
    res = requests.post(f"{BASE_URL}/register", json=payload)
    passed = res.status_code in [201, 409]
    print_result("User Registration", passed, "201 or 409", res.status_code, payload, res.text)

def test_login():
    payload = {"username": "ayesha roy", "password": "123456767"}
    res = requests.post(f"{BASE_URL}/login", json=payload)
    token = None
    passed = False
    if res.status_code == 200:
        try:
            token = res.json().get("access_token")
            passed = token is not None
        except Exception:
            passed = False
    print_result("Login Test", passed, {"username": payload["username"]}, res.text, payload, res.text)
    return token

def test_add_product(token):
    payload = {
        "name": "otg",
        "type": "Electronics",
        "sku": f"WM-{int(time.time())}",
        "image_url": "https://example.com/mo.jpg",
        "description": "Latest microwave oven",
        "quantity": 11,
        "price": 10000
    }
    res = requests.post(f"{BASE_URL}/products", json=payload, headers={"Authorization": f"Bearer {token}"})
    passed = res.status_code == 201
    if passed:
        print("Add Product: PASSED")
        try:
            return res.json().get("product_id")
        except Exception:
            return None
    else:
        print_result("Add Product", False, 201, res.status_code, payload, res.text)
        return None

def test_update_quantity(token, product_id, new_quantity):
    payload = {"quantity": new_quantity}
    res = requests.put(f"{BASE_URL}/products/{product_id}/quantity", json=payload, headers={"Authorization": f"Bearer {token}"})
    passed = res.status_code == 200
    if passed:
        try:
            updated_info = res.json()
            updated_qty = updated_info.get("quantity", "unknown")
            print(f"Update Quantity: PASSED, Updated quantity: {updated_qty}")
        except Exception:
            print("Update Quantity: PASSED, but response body is not valid JSON")
    else:
        print_result("Update Quantity", False, 200, res.status_code, payload, res.text)

def test_get_products(token, expected_quantity):
    time.sleep(1)  # allow database consistency
    res = requests.get(f"{BASE_URL}/products?limit=100", headers={"Authorization": f"Bearer {token}"})
    if res.status_code != 200:
        print_result("Get Products", False, 200, res.status_code, None, res.text)
        # return
    # try:
    products = res.json()
    #     print("Products returned:")
    #     for p in products:
    #         print("-", p.get("name"))
    # except Exception:
    #     print_result("Get Products", False, "valid JSON list", "Invalid JSON", None, res.text)
    #     return

    phone_products = [p for p in products if p.get("name", "").lower().strip() == "otg"]
    if not phone_products:
        print("Get Products: FAILED - No 'otg' product found")
        return

    phone_quantity = phone_products[0].get("quantity")
    if phone_quantity == expected_quantity:
        print(f"Get Products: PASSED (Quantity = {phone_quantity})")
    else:
        print("Get Products: FAILED")
        print(f"  Expected Quantity: {expected_quantity}, Got: {phone_quantity}")
        print(f"  Response Body: {products}")

def run_all_tests():
    test_register_user()
    token = test_login()
    if not token:
        print("Login failed. Skipping further tests.")
        return
    product_id = test_add_product(token)
    if not product_id:
        print("Product creation failed. Skipping further tests.")
        return
    new_quantity = 23
    test_update_quantity(token, product_id, new_quantity)
    test_get_products(token, expected_quantity=new_quantity)

if __name__ == "__main__":
    run_all_tests()