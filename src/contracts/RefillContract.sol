// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RefillContract {
  struct Product {
    uint id;
    string name;
    uint price;
    uint quantity;
  }
  
  mapping(uint => Product) public products;
  uint public productCount;
  
  event ProductAdded(uint id, string name, uint price, uint quantity);
  event RefillOrderPlaced(uint productId, uint quantity);
  
  function addProduct(string memory _name, uint _price, uint _quantity) public {
    productCount++;
    products[productCount] = Product(productCount, _name, _price, _quantity);
    emit ProductAdded(productCount, _name, _price, _quantity);
  }
  
  function refillOrder(uint _productId, uint _quantity) public {
    require(_productId > 0 && _productId <= productCount, "Invalid product id");
    require(products[_productId].quantity >= _quantity, "Not enough quantity available");
    products[_productId].quantity -= _quantity;
    emit RefillOrderPlaced(_productId, _quantity);
  }
}

