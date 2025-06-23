import { useState } from "react";

function text() {
  const [text, setText] = useState("");

  return (
    <div className="p-4">
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
        {text}
      </div>
    </div>
  );
}

export default text;
