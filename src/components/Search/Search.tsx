import './Search.css'

interface SearchProps {
  handleCancel: () => void;
}

function Search({ handleCancel }: SearchProps) {

  return (
    <div className="overlay">
      <div className="modal">
        <h3>Searching for players...</h3>
        <div className="spinner"></div>
        <button type="button" onClick={ handleCancel }>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Search
