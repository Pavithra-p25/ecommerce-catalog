import React, { useEffect, useState } from "react";

function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    stock: "",
    supplier: ""
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({});

  const BASE_URL = "http://localhost:5000"; // <-- backend URL

  // Fetch categories + products
  const fetchData = () => {
    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setError("Failed to fetch categories"));

    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setError("Failed to fetch products"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (editingProductId) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Add product
  const handleAdd = () => {
    const payload = {
      ...newProduct,
      category_id: Number(newProduct.category_id),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock)
    };

    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add product");
        return data;
      })
      .then(() => {
        setNewProduct({
          name: "",
          category_id: "",
          description: "",
          price: "",
          stock: "",
          supplier: ""
        });
        fetchData();
      })
      .catch(err => setError(err.message));
  };

  // Start editing
  const startEdit = product => {
    setEditingProductId(product.id);
    setEditingProduct({ ...product });
  };

  // Save edit
  const saveEdit = () => {
    const payload = {
      ...editingProduct,
      category_id: Number(editingProduct.category_id),
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock)
    };

    fetch(`${BASE_URL}/products/${editingProductId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to edit product");
        return data;
      })
      .then(() => {
        setEditingProductId(null);
        setEditingProduct({});
        fetchData();
      })
      .catch(err => setError(err.message));
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct({});
  };

  // Delete product
  const handleDelete = id => {
    fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete product");
        return data;
      })
      .then(() => fetchData())
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h1>Categories</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map(cat => (
          <li key={cat.id} style={{ textAlign: "left", margin: "0 auto", width: "200px" }}>
            {cat.name}
          </li>
        ))}
      </ul>

      <h1>Products</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Description</th>
            <th>Price</th><th>Stock</th><th>Supplier</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{editingProductId === prod.id ? <input name="name" value={editingProduct.name} onChange={handleChange} /> : prod.name}</td>
              <td>{editingProductId === prod.id ? (
                <select name="category_id" value={editingProduct.category_id} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              ) : prod.category_id}</td>
              <td>{editingProductId === prod.id ? <input name="description" value={editingProduct.description} onChange={handleChange} /> : prod.description}</td>
              <td>{editingProductId === prod.id ? <input name="price" value={editingProduct.price} onChange={handleChange} /> : prod.price}</td>
              <td>{editingProductId === prod.id ? <input name="stock" value={editingProduct.stock} onChange={handleChange} /> : prod.stock}</td>
              <td>{editingProductId === prod.id ? <input name="supplier" value={editingProduct.supplier} onChange={handleChange} /> : prod.supplier}</td>
              <td>{editingProductId === prod.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(prod)}>Edit</button>
                  <button onClick={() => handleDelete(prod.id)}>Delete</button>
                </>
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Product</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input placeholder="Name" name="name" value={newProduct.name} onChange={handleChange} />
        <select name="category_id" value={newProduct.category_id} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input placeholder="Description" name="description" value={newProduct.description} onChange={handleChange} />
        <input placeholder="Price" name="price" value={newProduct.price} onChange={handleChange} />
        <input placeholder="Stock" name="stock" value={newProduct.stock} onChange={handleChange} />
        <input placeholder="Supplier" name="supplier" value={newProduct.supplier} onChange={handleChange} />
      </div>
      <button style={{ marginTop: "10px" }} onClick={handleAdd}>Add Product</button>
    </div>
  );
}

export default Catalog;
