// import React from "react";
import "../styles/Bookdescription.css";
import React from "react";

const Bookdescription = ({ bookData }) => {
  // Handle base64 image or fallback
  const imageSrc = bookData.bookImage
    ? `data:image/jpeg;base64,${bookData.bookImage}`
    : "vite.svg";

  return (
    <div className="bookdescription">
      <div className="container mt-3">
        {/* Book Header */}
        <div className="row mb-4">
          <div className="col-md-4 text-center book-img">
            <img
              src={imageSrc}
              alt={bookData.bookTitle || "Unknown Title"}
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-8">
            <div className="book-info">
              <h4 className="fw-bold mb-3">{bookData.bookTitle || "Unknown Title"}</h4>
              <p>{bookData.description || "No description available."}</p>
              <p className="mb-3">By {bookData.author || "Unknown Author"}</p>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <h5 className="fw-bold mb-3">Book Details</h5>
        <table className="table table-borderless">
          <tbody>
            <tr>
              <th scope="row" className="fw-semibold">Author</th>
              <td>{bookData.author || "Unknown Author"}</td>
            </tr>
            <tr>
              <th scope="row" className="fw-semibold">Type</th>
              <td>{bookData.bookType || "Unknown Type"}</td>
            </tr>
            <tr>
              <th scope="row" className="fw-semibold">Language</th>
              <td>{bookData.bookLanguage || "Unknown Language"}</td>
            </tr>
          </tbody>
        </table>

        {/* Availability */}
        <h5 className="fw-bold mb-3">Availability</h5>
        <table className="table table-borderless">
          <tbody>
            <tr>
              <th
                scope="row"
                className="fw-semibold"
                style={{ color: bookData.availableCopies > 0 ? "green" : "red" }}
              >
                {bookData.availableCopies > 0 ? "Available" : "Unavailable"}
              </th>
              <td></td>
            </tr>
            <tr>
              <th scope="row" className="fw-semibold">Available Copies</th>
              <td >{bookData.availableCopies || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookdescription;

// import React from "react";

// const Bookdescription = () => {
//   return (
//     <div className="bookdescription">
//     <div className="container  mt-3">
//       {/* Book Header */}
//       <div className="row mb-4">
//         <div className="col-md-4 text-center book-img">
//           <img
//             src="vite.svg" // Static test image
//             alt="The Silent Observer"
//             className="img-fluid rounded shadow-sm"
//           />
//         </div>
//         <div className="col-md-8">
//             <div className="book-info">
//           <h4 className="fw-bold mb-3">The Silent Observer</h4>
//           <p>
//             A gripping thriller about a detective who must solve a series of mysterious
//             disappearances in a small town, all while battling her own inner demons
//             and a past that haunts her.
//           </p>
//           <p className="mb-3">By Amelia Stone</p>
//           </div>
//         </div>
//       </div>

//       {/* Book Details */}
//       <h5 className="fw-bold mb-3">Book Details</h5>
//       <table className="table table-borderless">
//         <tbody>
         
//           <tr>
//             <th scope="row" className="fw-semibold">Author</th>
//             <td>Amelia Stone</td>
//           </tr>
//           <tr>
//             <th scope="row" className="fw-semibold">Type</th>
//             <td>Thriller</td>
//           </tr>
//           <tr>
//             <th scope="row" className="fw-semibold">Language</th>
//             <td>English</td>
//           </tr>
        
//         </tbody>
//       </table>

//        <h5 className="fw-bold mb-3">Availabilty</h5>
//       <table className="table table-borderless">
//         <tbody>
//         <tr>
//             <th scope="row" className="fw-semibold" style={{color: "green"}}>Available</th>
//             <td></td>
//           </tr>
//           <tr>
//             <th scope="row" className="fw-semibold">Available Copies</th>
//             <td>5</td>
//           </tr>
          
//         </tbody>
//       </table>
//     </div>
//     </div>
//   );
// };

// export default Bookdescription;
