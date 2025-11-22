import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import "../styles/ViewCopy.css";
import {toast} from 'react-toastify';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';

const ViewCopy = () => {

  const [copies,setCopies] = useState([]);
  const [bookId,setBookId]=useState(0);
  const [error,setError]=useState('');
   const {token}=useContext(LmsContext)

  const handleSubmit =async (e) => {
    e.preventDefault();
    if(!bookId || bookId <= 0) {
      setError("Book ID is required");
      return;
    }else {
      setError('');
    }

    try {
        const response = await axios.get(`http://localhost:8081/lms/book/getBookCopies?bookId=${bookId}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if(response.data)
        {
          toast.success("copies fetched successfully");
          console.log("Book copies fetched successfully:", response.data);
          setCopies(response.data);
        }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to fetch book copies. Please try again.");
    }
    // Handle delete book logic here
  };

  return (
    <div >
      {copies.length > 0    ? (
        <div className='view-copy'>
          <h5>Available Copies:</h5>
          <table className='table'>
            <thead>
              <tr>
                <th>Copy ID</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {copies.map((copy, index) => (
                <tr key={index}>
                  <td>{copy.copyId}</td>
                  <td style={{ color: copy.copyStatus === 'Available' ? 'green' : 'red' }} >{copy.copyStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : 

      <div className="card shadow-sm p-4 form-container">
        <p className='error-text fs-6'>{error}</p>
    <form onSubmit={handleSubmit} >
      
      <div className="form-floating mb-3">
        <input type="text" name="bookId" value={bookId} className="form-control" id="bookId" placeholder="Book ID" onChange={(e) => setBookId(e.target.value)}  />
        <label htmlFor="bookId">Book Id</label>
      </div>
        <button type="submit" style={{backgroundColor:'#8c61b5', color: 'white'}} className="btn w-100 rounded-pill">Submit</button>

    </form>
    
  
    </div>

    
}
</div>
)
}
export default ViewCopy;
