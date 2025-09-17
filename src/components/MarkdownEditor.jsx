import React from "react";

export default function MarkdownEditor({ currentNote, updateNote }) {
  const [activeTab, setActiveTab] = React.useState("write");

  // Safety check for currentNote
  if (!currentNote) {
    return <div className="pane editor">No note selected</div>;
  }

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  };

  return (
    <section className="pane editor">
      <div className="mde-header">
        <div className="mde-tabs">
          <button
            className={`mde-tab ${activeTab === "write" ? "mde-tab-active" : ""}`}
            onClick={() => setActiveTab("write")}
          >
            Write
          </button>
          <button
            className={`mde-tab ${activeTab === "preview" ? "mde-tab-active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="mde-content">
        {activeTab === "write" ? (
          <textarea
            className="mde-text"
            value={currentNote.body || ""}
            onChange={(e) => updateNote(e.target.value)}
            placeholder="Type your markdown here..."
          />
        ) : (
          <div
            className="mde-preview"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(currentNote.body || "")
            }}
          />
        )}
      </div>
    </section>
  );
}