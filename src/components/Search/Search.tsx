import './Search.css'

function Search() {
  return (
    <div className="overlay">
      <div className="modal">
        <h3>Searching for players...</h3>
        <div className="spinner"></div>
        <button type="button" onClick={() => { /* Implement cancel search logic here */ }}>
      </div>
    </div>
  )
}

export default Search
