import React from 'react'
import '../styles/AddBook.css'
import { useState } from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
const AddBook = () => {

    const [copies,setCopies]=useState(false);
    const [copyid,setCopyId]=useState([]);
    const [error,setError]=useState('');
    const [errors, setErrors] = useState({});

     const {token,setReload}=useContext(LmsContext)
    const [formData, setFormData] = useState({
        bookTitle: '',
        bookType: '',
        author: '',
        bookLanguage: '',
        totalCopies: 0,
        bookImage: null,
        description: '',
       
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
  
   const newErrors = {};
    if (!formData.bookTitle.trim()) newErrors.bookTitle = "Book title is required";
    if (!formData.bookType.trim()) newErrors.bookType = "Book type is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.bookLanguage.trim()) newErrors.bookLanguage = "Book language is required";
    if (formData.bookTitle?.length > 30) {
  newErrors.bookTitle = "Title is must not exceed 30 characters";
}
if (formData.bookType?.length > 20) {
  newErrors.bookType = "Type must not exceed 20 characters";
}

if (formData.author?.length > 40) {
  newErrors.author = "Author must not exceed 40 characters";
}
if ( formData.bookLanguage?.length > 10) {
  newErrors.bookLanguage = "Language must not exceed 10 characters";
}
    if (!formData.totalCopies || formData.totalCopies <= 0) newErrors.totalCopies = "Total copies must be greater than 0";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.bookImage) newErrors.bookImage = "Book image is required";
       if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


  try {
     
    const ImageData = await axios.post("http://localhost:8081/lms/book/addBook",formData, {
       headers: { 'Content-Type': 'multipart/form-data' ,
        authorization: `Bearer ${token}`
       }
      
    });
    console.log("Response from server:", ImageData);
    if (ImageData.status==200) {
      setCopies(true);
      setCopyId(ImageData.data);
      console.log(ImageData.data);
       setErrors({});
      setFormData({
         bookTitle: '',
        bookType: '',
        author: '',
        bookLanguage: '',
        totalCopies: 0,
        bookImage: null,
        description: ''
    });
    setReload(true);
       toast.success("Book added successfully!");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error(error.response?.data?.message || "An unknown error occurred" );
  }
};

    const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      bookImage: e.target.files[0]
    }));
  }
    
  return (
    <div className='add-book'>
 
  {copies ? (
     <div className="card shadow-sm form-container">
      <p className='copy-text'> The Generated Copy Id's for {formData.bookTitle} are </p>
      <div className='copies'>
      <ul>
      {copyid.map((item, index) =>
        <li key={index}>{item}</li>
        
      )}
      </ul>
      </div>
      <button className='btn' style={{backgroundColor:'#8c61b5', color: 'white'}}  onClick={()=>setCopies(false)}>Close</button>
    </div>
  )
  :
    <div className="card shadow-sm p-4 form-container">
      <p className='error-text'>{error}</p>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      
      <div className="form-floating mb-3">
        <input type="text" name="bookTitle" value={formData.bookTitle} onChange={handleChange} className="form-control" id="bookTitle" placeholder="Book Title" />
        <label htmlFor="bookTitle">Book Title</label>
         {errors.bookTitle && <p className="error-text">{errors.bookTitle}</p>}

      </div>

                   <div className="form-floating mb-3">
                <input type="text" name="bookType" value={formData.bookType} onChange={handleChange} className="form-control" id="bookType" placeholder="Book Type" />
                <label htmlFor="bookType">Book Type</label>
                {errors.bookType && <p className="error-text">{errors.bookType}</p>}
              </div>


          <div className="form-floating mb-3">
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="form-control" id="author" placeholder="Author" />
                <label htmlFor="author">Author</label>
              {errors.author && <p className="error-text">{errors.author}</p>}
              </div>

              <div className="form-floating mb-3">
                <input type="text" name="bookLanguage" value={formData.bookLanguage} onChange={handleChange} className="form-control bg-grey" id="bookLanguage" placeholder="Book Language" />
                <label htmlFor="bookLanguage">Book Language</label>
                {errors.bookLanguage && <p className="error-text">{errors.bookLanguage}</p>}
              </div>

              <div className="form-floating mb-3">
                <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} className="form-control" id="totalCopies" placeholder="Total Copies" />
                <label htmlFor="totalCopies">Total Copies</label>
                {errors.totalCopies && <p className="error-text">{errors.totalCopies}</p>}
              </div>

  
           <div className="form-floating mb-3">
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" id="description" placeholder="Description" style={{ height: "100px" }} ></textarea>
                <label htmlFor="description">Description</label>
                {errors.description && <p className="error-text">{errors.description}</p>}
              </div>


              <div className="mb-4">
                <label htmlFor="bookImage" className="form-label image">Book Image</label>
                <input type="file" name="bookImage" accept="image/*" onChange={handleFileChange} className="form-control" id="bookImage" />
                {errors.bookImage && <p className="error-text">{errors.bookImage}</p>}
              </div>




        <button type="submit" style={{backgroundColor:'#8c61b5', color: 'white'}} className="btn w-100 rounded-pill">Submit</button>

    </form>
    </div>
}
  


</div>
  )
}

export default AddBook;


