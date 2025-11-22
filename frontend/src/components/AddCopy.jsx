import React, { use } from 'react'
import '../styles/AddCopy.css'
import { useState } from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext.jsx';
import {toast} from 'react-toastify';

const AddCopy = (props) => {
    const { reload, setReload ,token} = useContext(LmsContext);
   const [copies,setCopies]=useState(false);
  
   const [error,setError]=useState('');
      const [copyid,setCopyId]=useState([]);
    const [formData, setFormData] = useState({
        bookId: props.bookId,
        totalCopies: 0,
      })
    const handleChange=(e)=>{
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
   const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.totalCopies || formData.totalCopies <= 0) {
    setError("Total Copies must be greater than 0");
    return;
  }
  else {
      setError('');
    }

  try {
    const copyData =await axios.post(`http://localhost:8081/lms/book/addCopies?bookId=${formData.bookId}&bookCopies=${formData.totalCopies}`,null, {
           headers: { 
            authorization: `Bearer ${token}`
           }
    });
    console.log("Response from server:", copyData);
    if (copyData.status==200) {
      toast.success("Copies Added Successfully");
       setReload(true);
      setCopies(true);
      setCopyId(copyData.data);
      console.log(copyData.data);
      
      // Trigger reload in context
      setFormData({
        bookId: props.bookId,
        totalCopies: 0
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to add copies. Please try again.");
  }
};
  return (
    <div className='add-book'>
  {copies ? (
     <div className="card shadow-sm form-container">
      <p className='copy-text'> The Generated Copy Id's for {formData.bookId} are </p>
      <div className='copies'>
      <ul>
      {copyid.map((item, index) =>
        <li key={index}>{item}</li>
        
      )}
      </ul>
      </div>
      <button className='btn btn-primary' onClick={()=>setCopies(false)}>Close</button>
    </div>
  )
  :
    <div className="card shadow-sm p-4 form-container">
      <p className='error-text fs-6'>{error}</p>
    <form onSubmit={handleSubmit}>
      
      <div className="form-floating mb-3">
        <input type="text" name="bookId" value={formData.bookId} onChange={handleChange} disabled className="form-control" id="bookId" placeholder="Book Id" required />
        <label htmlFor="bookId">Book Id</label>
      </div>
  
          <div className="form-floating mb-3">
            <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} className="form-control" id="totalCopies" placeholder="Total Copies" />
            <label htmlFor="totalCopies">Total Copies</label>
          </div>
        <button type="submit" style={{backgroundColor:'#8c61b5', color: 'white'}} className="btn w-100 rounded-pill">Submit</button>

    </form>
    </div>
}
</div>
  )
}


export default AddCopy;
