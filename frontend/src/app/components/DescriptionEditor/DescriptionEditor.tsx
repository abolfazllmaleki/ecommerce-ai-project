'use client';
import { useRef, useState } from 'react';

interface DescriptionEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const DescriptionEditor = ({ value, onChange, placeholder = "Enter text..." }: DescriptionEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertBulletList = () => {
    formatText('insertUnorderedList');
  };

  const insertNumberedList = () => {
    formatText('insertOrderedList');
  };

  const insertTable = () => {
    // Create a more robust table with proper structure
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 12px 0; border: 1px solid #ddd;">';
    
    // Add header row
    tableHTML += '<thead><tr>';
    for (let j = 0; j < tableCols; j++) {
      tableHTML += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f9fa; text-align: left;">Header ${j + 1}</th>`;
    }
    tableHTML += '</tr></thead>';
    
    // Add body rows
    tableHTML += '<tbody>';
    for (let i = 0; i < tableRows - 1; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">Content</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    
    // Insert at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const div = document.createElement('div');
      div.innerHTML = tableHTML;
      
      // Extract the table node from the div
      const tableNode = div.firstChild;
      
      if (tableNode) {
        range.deleteContents();
        range.insertNode(tableNode);
        
        // Place cursor after the table
        range.setStartAfter(tableNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        handleChange();
      }
    }
    
    setShowTableModal(false);
  };

  const insertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(event) {
        if (event.target && event.target.result) {
          formatText('insertImage', event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset the input
    }
  };

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-colors">
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 p-2 gap-1">
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Bold"
            onClick={() => formatText('bold')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h16M7 12h10m-3 6h4"></path>
            </svg>
          </button>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Italic"
            onClick={() => formatText('italic')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M3 4h16"></path>
            </svg>
          </button>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Underline"
            onClick={() => formatText('underline')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V5m14 14V5m-7 14V5"></path>
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Bullet List"
            onClick={insertBulletList}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </button>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Numbered List"
            onClick={insertNumberedList}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Insert Table"
            onClick={() => setShowTableModal(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <label className="p-1 rounded hover:bg-gray-200 cursor-pointer" title="Insert Image">
            <input
              type="file"
              accept="image/*"
              onChange={insertImage}
              className="hidden"
              id="desc-image-upload"
            />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </label>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200" 
            title="Link"
            onClick={() => {
              const url = prompt('Enter URL:', 'https://');
              if (url) formatText('createLink', url);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </button>
        </div>
        <div
          ref={editorRef}
          className="w-full p-3 min-h-[200px] resize-y outline-none overflow-y-auto"
          contentEditable
          onInput={handleChange}
          style={{ minHeight: '200px' }}
          dangerouslySetInnerHTML={{ __html: value }}
        ></div>
      </div>

      {/* Table Insertion Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Insert Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rows</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DescriptionEditor;