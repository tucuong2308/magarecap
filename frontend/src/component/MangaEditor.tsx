import React, { useEffect, useState } from "react";
import "./MangaEditor\.css";
import {
  Save,
  FileText,
  Folder,
  Grid,
  Search,
  Sparkles,
  Play,
  Type,
  RotateCcw,
  RotateCw,
  Trash2,
  MousePointer2,
  Crop,
  Eraser,
  Undo2,
  Redo2,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
} from "lucide-react";

interface TableRow {
  id: number;
  mediaPath: string;
  text: string;
  translation: string;
}

interface MangaEditorProps {
  initialRows?: TableRow[];
  imageUrl?: string;
}

const MangaEditor: React.FC<MangaEditorProps> = (props) => {
  const {
    initialRows = Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      mediaPath: "C:/Users/hoa",
      text: i === 1 ? "Selected Text" : "",
      translation: "",
    })),
    imageUrl = "https://csspicker.dev/api/image/?q=anime+girl+manga&image_type=photo",
  } = props;

  const [rows, setRows] = useState<TableRow[]>(() => {
    if (typeof window === "undefined") {
      return initialRows;
    }

    const savedRows = window.localStorage.getItem("manga-editor-table-data");

    if (!savedRows) {
      return initialRows;
    }

    try {
      const parsedRows = JSON.parse(savedRows);
      return Array.isArray(parsedRows) ? parsedRows : initialRows;
    } catch {
      return initialRows;
    }
  });
  const [selectedRow, setSelectedRow] = useState<number | null>(2);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:5000/rows")
      .then((res) => res.json())
      .then((data) => {
        // Map backend snake_case to frontend camelCase
        const mappedData = data.map(
          (row: {
            id: number;
            media_path: string;
            text: string;
            translation: string;
          }) => ({
            id: row.id,
            mediaPath: row.media_path || "",
            text: row.text || "",
            translation: row.translation || "",
          }),
        );
        if (mappedData.length > 0) {
          setRows(mappedData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rows:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (props.initialRows) {
      setRows(props.initialRows);
    }
  }, [props.initialRows]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      "manga-editor-table-data",
      JSON.stringify(rows),
    );
  }, [rows]);

  const handleSaveTableData = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      "manga-editor-table-data",
      JSON.stringify(rows),
    );
  };

  const handleCellChange = (
    rowId: number,
    field: keyof TableRow,
    value: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  return (
    <div className="manga-editor-container">
      {/* Top Header Bar */}
      <div className="manga-editor-header">
        <div className="manga-editor-header-left">
          <button
            className="manga-editor-header-icon-btn"
            onClick={handleSaveTableData}
            title="Save table data"
          >
            <Save size={16} />
          </button>
          <FileText size={16} className="manga-editor-header-icon" />
          <Folder size={16} className="manga-editor-header-icon" />
          <Grid size={16} className="manga-editor-header-icon" />
          <div className="manga-editor-search">
            <Search size={14} className="manga-editor-search-icon" />
            <input
              type="text"
              className="manga-editor-search-input"
              placeholder="Search features..."
            />
          </div>
          <button className="manga-editor-primary-btn">
            <Sparkles size={14} />
            <span>Narration Generator</span>
          </button>
        </div>
        <div className="manga-editor-header-right">
          <div className="manga-editor-player">
            <Play size={16} className="manga-editor-play-icon" />
            <div className="manga-editor-separator"></div>
            <div className="flex space-x-1">
              <div className="manga-editor-status-dot"></div>
              <div className="manga-editor-status-dot"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="manga-editor-main">
        {/* Left Panel: Table */}
        <div className="manga-editor-left-panel">
          <div className="manga-editor-toolbar">
            <button className="manga-editor-font-btn">
              <Type size={12} className="mr-1" /> Decrease Font
            </button>
            <button className="manga-editor-font-btn">
              <Type size={12} className="mr-1" /> Increase Font
            </button>
            <button className="manga-editor-font-btn">
              <Type size={12} className="mr-1" /> Reset Font
            </button>
          </div>

          <div className="manga-editor-table-wrapper custom-scrollbar">
            <table className="manga-editor-table">
              <thead className="manga-editor-thead">
                <tr className="manga-editor-header-row">
                  <th className="manga-editor-th-index"></th>
                  <th className="manga-editor-th-media">Media Path</th>
                  <th className="manga-editor-th-text text-blue-400">Text</th>
                  <th className="manga-editor-th-translation">Translation</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      Loading data from server...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      No data available
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRow(row.id)}
                      className={`manga-editor-row ${selectedRow === row.id ? "manga-editor-row-selected" : "manga-editor-row-hover"}`}
                    >
                      <td className="manga-editor-td-index">{row.id}</td>
                      <td className="manga-editor-td-media">
                        <input
                          type="text"
                          className="manga-editor-cell-input"
                          value={row.mediaPath}
                          onChange={(e) =>
                            handleCellChange(
                              row.id,
                              "mediaPath",
                              e.target.value,
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td
                        className={`manga-editor-td-text ${selectedRow === row.id ? "manga-editor-td-text-selected" : ""}`}
                      >
                        <input
                          type="text"
                          className="manga-editor-cell-input"
                          value={row.text}
                          onChange={(e) =>
                            handleCellChange(row.id, "text", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="manga-editor-td-translation">
                        <input
                          type="text"
                          className="manga-editor-cell-input"
                          value={row.translation}
                          onChange={(e) =>
                            handleCellChange(
                              row.id,
                              "translation",
                              e.target.value,
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Left Bottom Status */}
          <div className="manga-editor-status-bar">
            <div className="manga-editor-status-left">
              <div className="manga-editor-status-indicator"></div>
              <Hand size={14} className="text-gray-400" />
            </div>
            <div className="manga-editor-status-right">
              <span>Font Size: 12</span>
              <span>Padding: 8</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="manga-editor-right-panel">
          {/* Vertical Toolbar */}
          <div className="manga-editor-toolbar-vertical">
            <div className="manga-editor-toolbar-label">Select Tool (V)</div>
            <MousePointer2
              size={18}
              className="manga-editor-toolbar-icon-primary"
            />
            <Crop size={18} className="manga-editor-toolbar-icon" />
            <Eraser size={18} className="manga-editor-toolbar-icon" />
            <Trash2 size={18} className="manga-editor-toolbar-icon" />
            <div className="manga-editor-toolbar-divider"></div>
            <Undo2 size={18} className="manga-editor-toolbar-icon" />
            <Redo2 size={18} className="manga-editor-toolbar-icon" />
            <RotateCcw size={18} className="manga-editor-toolbar-icon" />
            <RotateCw size={18} className="manga-editor-toolbar-icon" />
            <FlipHorizontal size={18} className="manga-editor-toolbar-icon" />
            <FlipVertical size={18} className="manga-editor-toolbar-icon" />
          </div>

          {/* Image Canvas Area */}
          <div className="manga-editor-canvas-area">
            <div className="manga-editor-status-label">Ready</div>

            <div className="manga-editor-canvas-wrapper">
              <div className="manga-editor-canvas">
                <img
                  src={imageUrl}
                  alt="Manga Preview"
                  className="manga-editor-image"
                />

                {/* Speech Bubble Overlay */}
                <div className="manga-editor-bubble-wrapper">
                  <div className="manga-editor-bubble">
                    <p className="manga-editor-bubble-text">
                      YOUR MISCHIEF
                      <br />
                      ENDS HERE.
                    </p>
                    {/* Bubble Tail */}
                    <div className="manga-editor-bubble-tail"></div>
                  </div>
                </div>

                {/* Progress Overlay */}
                <div className="manga-editor-progress-overlay">
                  <span className="manga-editor-progress-text">31%</span>
                </div>
              </div>
            </div>

            {/* Bottom Zoom Controls */}
            <div className="manga-editor-zoom-bar">
              <div className="manga-editor-zoom-left">
                <Search size={14} className="manga-editor-zoom-icon" />
                <div className="manga-editor-zoom-track">
                  <div className="manga-editor-zoom-progress"></div>
                  <div className="manga-editor-zoom-thumb"></div>
                </div>
              </div>
              <div className="manga-editor-zoom-right">
                <div className="manga-editor-zoom-button">
                  <ZoomOut size={14} className="manga-editor-zoom-icon" />
                </div>
                <div className="manga-editor-zoom-button">
                  <ZoomIn size={14} className="manga-editor-zoom-icon" />
                </div>
                <div className="manga-editor-zoom-button">
                  <Maximize size={14} className="manga-editor-zoom-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaEditor;
