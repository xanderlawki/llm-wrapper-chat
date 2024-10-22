import React, { useState } from "react";

const CommandModal = ({ onClose, onSubmit }) => {
  const [url, setUrl] = useState("");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [maxExecutionTime, setMaxExecutionTime] = useState(300);
  const [filter, setFilter] = useState(false);
  const [store, setStore] = useState(false);

  const handleSubmit = () => {
    const command = `[include-url: ${url} max_execution_time:${maxExecutionTime} filter:${filter} store:${store}]`;
    onSubmit(command);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Insert URL</h3>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />

        {advancedMode && (
          <>
            <label>
              Max Execution Time:
              <input
                type="number"
                value={maxExecutionTime}
                onChange={(e) => setMaxExecutionTime(Number(e.target.value))}
              />
            </label>

            <label>
              Filter Content:
              <input
                type="checkbox"
                checked={filter}
                onChange={(e) => setFilter(e.target.checked)}
              />
            </label>

            <label>
              Store Content:
              <input
                type="checkbox"
                checked={store}
                onChange={(e) => setStore(e.target.checked)}
              />
            </label>
          </>
        )}

        <button onClick={() => setAdvancedMode(!advancedMode)}>
          {advancedMode ? "Basic Mode" : "Advanced Mode"}
        </button>

        <button onClick={handleSubmit}>Insert Command</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CommandModal;
