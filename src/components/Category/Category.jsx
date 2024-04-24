import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { CiSearch } from "react-icons/ci";
 const Category = () => {
   const head = ["ID", "Name", "Actions", "Edit"];
  const data = [
    { id: 1, name: 'John', age: 30, city: 'New York' },
    { id: 2, name: 'Alice', age: 25, city: 'Los Angeles' },
    { id: 3, name: 'Bob', age: 35, city: 'Chicago' },
    { id: 4, name: 'Emma', age: 28, city: 'San Francisco' },
  ];
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bg-slate-700 py-10  m-3 rounded-md">
      <div className="flex justify-between items-center px-5">
        <div className="relative w-96">
          <input
            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          />
          <CiSearch className="absolute top-2 right-3 text-white text-xl" />
        </div>
        <div className="flex items-center">
          <Button className="bg-orange-900 w-24">Add</Button>
        </div>
      </div>
      <table className="text-white mt-5">
        <thead>
          <tr className="bg-gray-500 py-3">
            {head.map((item) => (
              <th className="text-white px-4 py-3 text-xl">{item}</th>
            ))}

          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="text-gray-300 px-4 py-3 text-xl">{row.id}</td>
              <td className="text-gray-300 px-4 py-3 text-xl">{row.name}</td>
              <td className="text-gray-300 px-4 py-3 text-xl">{row.age}</td>
              <td className="text-gray-300 px-4 py-3 text-xl">{row.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Category


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import styles from './Category.module.css';
// import { Translate, useLanguage } from 'translate-easy';
// import LogOut from '../LogOut/LogOut';
// import { Link } from 'react-router-dom';
// import Loading from '../Loading/Loading';
// import ConfirmationModal from './ConfirmationModel';
// import MainComponent from '../Aside/MainComponent';
// import { jwtDecode } from "jwt-decode";
// import Cookies from 'js-cookie';

// const API_category = 'https://store-system-api.gleeze.com/api/categories';

// const CategoryTable = () => {
//   const token = Cookies.get('token');
//   const [categories, setCategories] = useState([]);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pagination, setPagination] = useState({});
//   const [loading, setLoading] = useState(true);
//   const { selectedLanguage } = useLanguage();
//   const decodedToken = jwtDecode(token);

//   const fetchData = useCallback(async () => {
//     try {
//       if (token) {
//         const response = await axios.get(`${API_category}?search=${searchInput}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
//         setCategories(response.data.data);
//         setPagination(response.data.paginationResult);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [token, searchInput, pagination.currentPge]);

//   useEffect(() => {
//     fetchData();
//   }, [searchInput, fetchData]);

//   const handleSearch = () => {
//     setSearchInput(searchTerm);
//   };

//   const handleDeleteCategory = (categoryId) => {
//     setSelectedCategoryId(categoryId);
//     setShowConfirmation(true);
//   };

//   const confirmDelete = useCallback(() => {
//     axios.delete(`${API_category}/${selectedCategoryId}`, { headers: { Authorization: `Bearer ${token}` } })
//       .then(() => fetchData())
//       .catch((error) => console.error('Error deleting category:', error))
//       .finally(() => {
//         setShowConfirmation(false);
//         setSelectedCategoryId(null);
//       });
//   }, [selectedCategoryId, token, fetchData]);

//   const cancelDelete = useCallback(() => {
//     setShowConfirmation(false);
//     setSelectedCategoryId(null);
//   }, []);

//   const confirmAddCategory = useCallback(() => {
//     axios.post(`${API_category}`, { name: newCategoryName }, { headers: { Authorization: `Bearer ${token}` } })
//       .then(() => fetchData())
//       .catch((error) => console.error('Error adding category:', error))
//       .finally(() => setNewCategoryName(''));
//   }, [newCategoryName, token, fetchData]);

//   const handlePageChange = (newPage) => {
//     setPagination({
//       ...pagination,
//       currentPge: newPage
//     });
//   }

//   return (
//     <div>
//       <LogOut />
//       <MainComponent />
//       <div className={styles.flex}>
//         <div>
//           <input type="search" name="search" className={styles.margin} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           <button className='btn btn-primary' onClick={handleSearch}>
//             <Translate>A Search</Translate>
//           </button>
//         </div>
//         {decodedToken.role === "admin" &&
//           <div>
//             <input type="text" name="name" className={styles.margin} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
//             <button className='btn btn-primary' onClick={confirmAddCategory}>
//               <Translate translations={{ ar: 'ضيف', en: 'Add' }}>{selectedLanguage === 'ar' ? 'ضيف' : 'Add'}</Translate>
//             </button>
//           </div>
//         }
//       </div>
//       <div className={styles.container}>
//         {loading && <div className='m-5 fs-3'><Loading /></div>}
//         {!loading && (
//           <>
//             <div className={styles.categoryTable}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th><Translate>ID</Translate></th>
//                     <th><Translate>Name</Translate></th>
//                     {decodedToken.role === "admin" &&
//                       <th><Translate>Actions</Translate></th>
//                     }
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories.map(category => (
//                     <tr key={category._id}>
//                       <td>{category._id.slice(-4)}</td>
//                       <td>
//                         <Link to={`/category/${category._id}/products`} className={styles.categoryLink}>
//                           {category.name}
//                         </Link>
//                       </td>
//                       {decodedToken.role === "admin" &&
//                         <td>
//                           <Link to={`/update/${category._id}`} className={styles.updateBtn}>
//                             <Translate translations={{ ar: 'تعديل', en: 'update' }}>{selectedLanguage === 'ar' ? 'تعديل' : 'update'}</Translate>
//                           </Link>

//                           <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(category._id)}>
//                             <Translate translations={{ ar: 'حذف', en: "Delete" }}>{selectedLanguage === 'ar' ? "حذف" : "Delete"}</Translate>
//                           </button>
//                         </td>
//                       }
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <ConfirmationModal
//                 show={showConfirmation}
//                 onConfirm={confirmDelete}
//                 onCancel={cancelDelete}
//               />
//               {categories.length === 0 && <p>No categories available</p>}
//             </div>
//           </>
//         )}
//       </div>
//       <div>
//         <div className={styles.flex}>
//           {pagination.prev && (
//             <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
//               {pagination.prev}
//             </button>
//           )}
//           <button className={styles.paginationNext}><Translate>Page</Translate> {pagination.currentPge}</button>
//           {pagination.next && (
//             <button className={styles.paginationNext} onClick={() => handlePageChange(pagination.next)}>
//               {pagination.next}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryTable;
