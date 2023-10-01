import { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchInputRef = useRef();

  // Assume fetchSuggestions is a function that fetches search suggestions from an API
  const fetchSuggestions = debounce(async (term) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call or searching logic
      const results = await fakeApiCall(term);
      setSuggestions(results);
    } catch (error) {
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (searchTerm) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      setSearchTerm(suggestions[highlightIndex]);
      setSuggestions([]);
    }
  };

  return (
    <div role="combobox" aria-haspopup="listbox" aria-owns="suggestion-list" aria-expanded={!!suggestions.length}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="suggestion-list"
        ref={searchInputRef}
      />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <ul id="suggestion-list" role="listbox">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            role="option"
            aria-selected={index === highlightIndex}
            onMouseEnter={() => setHighlightIndex(index)}
            onClick={() => {
              setSearchTerm(suggestion);
              setSuggestions([]);
            }}
          >
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
