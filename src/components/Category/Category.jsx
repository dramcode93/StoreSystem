import React, { useState, useEffect } from 'react';
import styles from './Category.module.css'; // Import the CSS file for styling
import { Translate } from 'translate-easy';

const CategoryTable = () => {
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem('categories')) || [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
      // Add more categories as needed
    ]
  );

  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // const handleDelete = (categoryId) => {
  //   const updatedCategories = categories.filter((category) => category.id !== categoryId);
  //   setCategories(updatedCategories);
  // };

  // const handleUpdate = (categoryId, newName) => {
  //   const updatedCategories = categories.map((category) =>
  //     category.id === categoryId ? { ...category, name: newName } : category
  //   );
  //   setCategories(updatedCategories);
  // };

  const handleAdd = () => {
    if (newCategory.trim() !== '') {
      const newCategoryId = categories.length + 1;
      const newCategoryObj = { id: newCategoryId, name: newCategory };
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
    }
  };

  return (
    <div className={styles.container}>
      <div>
      <div className={styles.addCategory}>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className={styles.addBtn} onClick={handleAdd}>
        <Translate>Add</Translate>  
        </button>
      </div>
      <table className={styles.categoryTable}>
        <thead>
          <tr>
            <th><Translate>ID</Translate></th>
            <th><Translate>Name</Translate></th>
            <th><Translate>Actions</Translate></th>
            </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button
                  className={styles.updateBtn}
                >
                 <Translate>Update</Translate> 
                </button>
                <button className={styles.deleteBtn}>
                  
                  <Translate>Delete</Translate> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default CategoryTable;



















/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Category.css';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://your-api-url/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://your-api-url/categories/${categoryId}`);
      fetchCategories(); // Fetch updated categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdate = async (categoryId, newName) => {
    try {
      await axios.put(`http://your-api-url/categories/${categoryId}`, { name: newName });
      fetchCategories(); // Fetch updated categories after update
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://your-api-url/categories', { name: newCategory });
      fetchCategories(); // Fetch updated categories after addition
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <div className="add-category">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td className="flex">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(category.id, prompt('Enter new name:'))}
                >
                  Update
                </button>
                <button className="delete-btn" onClick={() => handleDelete(category.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;

*/