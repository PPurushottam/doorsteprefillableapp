import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RefillContract from './build/contracts/RefillContract.json';
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [productId, setProductId] = useState(0);
  const [refillQuantity, setRefillQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = RefillContract.networks[networkId];
          const contract = new web3.eth.Contract(
            RefillContract.abi,
            deployedNetwork && deployedNetwork.address,
          );
          setContract(contract);

          const productCount = await contract.methods.productCount().call();
          const products = [];
          for (let i = 1; i <= productCount; i++) {
            const product = await contract.methods.products(i).call();
            products.push(product);
          }
          setProducts(products);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadBlockchainData();
  }, []);

  const addProduct = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await contract.methods.addProduct(name, price, quantity).send({ from: accounts[0] });
    const product = await contract.methods.products(products.length + 1).call();
    setProducts([...products, product]);
    setName('');
    setPrice(0);
    setQuantity(0);
    setIsLoading(false);
  };

  const refillOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await contract.methods.refillOrder(productId, refillQuantity).send({ from: accounts[0] });
    const product = await contract.methods.products(productId).call();
    setProducts([
      ...products.slice(0, productId - 1),
      product,
      ...products.slice(productId),
    ]);
    setRefillQuantity(0);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>Refill App</h1>
      <p>Connected to: {accounts.length > 0 ? accounts[0] : 'Not connected'}</p>
      <hr />
      <h2>Add Product</h2>
      <form onSubmit={addProduct}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        <br />
        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={(event) => setPrice(event.target.value)} required />
        <br />
        <label htmlFor="quantity">Quantity:</label>
        <input type="number" id="quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
        <br />
        <button type="submit" disabled={isLoading}>Add Product</button>
      </form>
      <hr />
      <h2>Refill Order</h2>
      <form onSubmit={refillOrder}>
        <label htmlFor="productId">Product:</label>
        <select id="productId" value={productId} onChange={(event) => setProductId(event.target.value)} required>
          <option value="">Select a product</option>
          {products.map((product, index) => (
            <option key={index} value={product.id}>{product.name}</option>
          ))}
        </select>
        <br />
        <label htmlFor="refillQuantity">Refill Quantity:</label>
        <input type="number" id="refillQuantity" value={refillQuantity} onChange={(event) => setRefillQuantity(event.target.value)} required />
        <br />
        <button type="submit" disabled={isLoading}>Initiate Refill Order</button>
      </form>
      <hr />
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Refill Count</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.refillCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
       
