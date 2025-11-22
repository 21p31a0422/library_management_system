import axios from 'axios';
import React from 'react'
import { useContext ,useState} from 'react';
import { LmsContext } from '../context/LmsContext.jsx';
import {toast} from 'react-toastify';
const DeleteBook = (props) => {
  const { bookId } = props;
   const { reload, setReload,token } = useContext(LmsContext);
   
   const [error,setError] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!bookId || bookId <= 0) {
      setError("Book ID is required");
      return;
    } else {
      setError('');
    }

    try {
        const response = await axios.delete(`http://localhost:8081/lms/book/deleteBook?bookId=${bookId}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if(response.data)
        {
          setReload(true);
          toast.success("Book deleted successfully!");
        }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book. Please try again.");
    }
    // Handle delete book logic here
  };

  return (
    <div>
      {reload ? (
        <div>
          <p>Book deleted successfully!</p>
    </div>) :

      <div className="card shadow-sm p-4 form-container">
        <p className='error-text fs-6'>{error}</p>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      
      <div className="form-floating mb-3">
        <input type="text" name="bookId" value={bookId} disabled className="form-control" id="bookId" placeholder="Book ID" required />
        <label htmlFor="bookId">Book Id</label>
      </div>
        <button type="submit" style={{backgroundColor:'#8c61b5', color: 'white'}} className="btn w-100 rounded-pill">Delete</button>

    </form>
    
  
    </div>

    
}
</div>
)
}
export default DeleteBook;
