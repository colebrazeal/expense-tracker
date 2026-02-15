import React, { useState } from 'react';
import './CategoryManager.css';
import { categoryAPI } from '../services/api';

function CategoryManager({ categories, onCategoriesChange }) {
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      await categoryAPI.create(newCategory);
      setNewCategory({ name: '', type: 'expense' });
      setShowForm(false);
      onCategoriesChange();
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response?.status === 409) {
        alert('A category with this name already exists');
      } else {
        alert('Failed to create category');
      }
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      await categoryAPI.update(editingCategory.id, {
        name: editingCategory.name,
        type: editingCategory.type,
      });
      setEditingCategory(null);
      onCategoriesChange();
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response?.status === 409) {
        alert('A category with this name already exists');
      } else {
        alert('Failed to update category');
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        onCategoriesChange();
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        if (error.response?.status === 400) {
          alert('Cannot delete category that is used in transactions');
        } else {
          alert('Failed to delete category');
        }
      }
    }
  };

  const incomeCategories = categories.filter((cat) => cat.type === 'income');
  const expenseCategories = categories.filter((cat) => cat.type === 'expense');

  return (
    <div className="category-manager-container">
      <h2>Manage Categories</h2>

      <button
        className="btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Add New Category'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateCategory} className="category-form">
          <h3>Add New Category</h3>
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              value={newCategory.type}
              onChange={(e) =>
                setNewCategory({ ...newCategory, type: e.target.value })
              }
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Create Category
          </button>
        </form>
      )}

      <div className="categories-section">
        <div className="category-group">
          <h3>Income Categories ({incomeCategories.length})</h3>
          <div className="category-list">
            {incomeCategories.map((category) => (
              <div key={category.id} className="category-item income">
                {editingCategory?.id === category.id ? (
                  <form onSubmit={handleUpdateCategory} className="edit-form">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="category-name">{category.name}</span>
                    <div className="category-actions">
                      <button
                        className="btn-edit"
                        onClick={() => setEditingCategory(category)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="category-group">
          <h3>Expense Categories ({expenseCategories.length})</h3>
          <div className="category-list">
            {expenseCategories.map((category) => (
              <div key={category.id} className="category-item expense">
                {editingCategory?.id === category.id ? (
                  <form onSubmit={handleUpdateCategory} className="edit-form">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="category-name">{category.name}</span>
                    <div className="category-actions">
                      <button
                        className="btn-edit"
                        onClick={() => setEditingCategory(category)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;