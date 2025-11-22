import axios from 'axios';
import React from 'react'
import { useContext,useState } from 'react';
import { LmsContext } from '../context/LmsContext.jsx';
import {toast} from 'react-toastify';
const DeleteCopy = ({bookId}) => {
  
   const { reload, setReload,token } = useContext(LmsContext);
   const [copyId, setCopyId] = useState(0);
  
   const [error, setError] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();

    if (!copyId || copyId <= 0) {
      setError("Copy ID is required");
      return;
    } else {
      setError('');
    }

    try {
      console.log(bookId)
        const response = await axios.delete(`http://localhost:8081/lms/book/deleteCopy?copyId=${copyId}&bookId=${bookId}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if(response.data)
        {
          setReload(true);
          toast.success("Copy deleted successfully!");
        }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(error.response.data.message);
    }
    // Handle delete book logic here
  };

  return (
    <div>
      {reload ? (
        <div>
          <p>Copy deleted successfully!</p>
    </div>) :

      <div className="card shadow-sm p-4 form-container">
        <p className='error-text fs-6'>{error}</p>
    <form onSubmit={handleSubmit} >
      
      <div className="form-floating mb-3">
        <input type="number" name="copyId" value={copyId}  className="form-control" id="copyId" placeholder="Copy ID" onChange={(e) => setCopyId(e.target.value)} />
        <label htmlFor="copyId">Copy Id</label>
      </div>
        <button type="submit" style={{backgroundColor:'#8c61b5', color: 'white'}} className="btn w-100 rounded-pill">Delete</button>

    </form>
    
  
    </div>

    
}
</div>
)
}
export default DeleteCopy;
