import React, { useState } from "react";
import './ActionItems.css';

const ActionItems = ({ actionItems, setActionItems, isInputDisabled }) => {
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = () => {
    if (isInputDisabled) {
      alert("Please select a date first."); // Guard against adding items without a selected date
      return;
    }
    if (newItemText.trim()) {
      // Add a new item to the actionItems array
      setActionItems([...actionItems, { text: newItemText, completed: false }]);
      setNewItemText(""); // Clear input after adding
    }
  };

  const handleCheckboxChange = (index) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    // Toggle the completion status of the item
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
    // Remove the item from the actionItems array
    const updatedItems = actionItems.filter((_, i) => i !== index);
    setActionItems(updatedItems);
  };

  const handleInputChange = (index, e) => {
    if (isInputDisabled) {
      alert("Please select a date first.");
      return;
    }
    // Update the text of the item
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
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
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
