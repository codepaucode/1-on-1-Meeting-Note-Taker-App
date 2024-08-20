import React, { useState } from "react";
import './ActionItems.css';

const ActionItems = ({ actionItems, setActionItems, isInputDisabled }) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    if (newItem.trim()) {
      setActionItems([...actionItems, { text: newItem, completed: false }]);
      setNewItem(""); // Clear input after adding
    }
  };

  const handleCheckboxChange = (index) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    const updatedItems = actionItems.map((item, i) => (
      i === index ? { ...item, completed: !item.completed } : item
    ));
    setActionItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    const updatedItems = actionItems.filter((_, i) => i !== index);
    setActionItems(updatedItems);
  };

  const handleInputChange = (index, e) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    const updatedItems = actionItems.map((item, i) => (
      i === index ? { ...item, text: e.target.value } : item
    ));
    setActionItems(updatedItems);
  };

  return (
    <div className="action-items-container">
      <h2>Action Items</h2>
      <ul className="action-items-list">
        {actionItems.map((item, index) => (
          <li key={index} className="action-item">
            <div className="input-container">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleCheckboxChange(index)}
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleInputChange(index, e)}
                onClick={() => {
                  if (isInputDisabled) {
                    alert("Please select a date first.");
                  }
                }}
                className="edit-input"
                style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
              />
              <button className="remove-item-button" onClick={() => handleRemoveItem(index)}>x</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="add-item-container">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onClick={() => {
            if (isInputDisabled) {
              alert("Please select a date first.");
            }
          }}
          placeholder="Add new action item"
          className="new-item-input"
        />
        <button className="add-item-button" onClick={handleAddItem}>+</button>
      </div>
    </div>
  );
};

export default ActionItems;
