import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles.module.css';
import ConfirmationModal from '../../Category/ConfirmationModel';
 import PrintButton from '../PrintButton';
import Loading from '../../Loading/Loading';
import axios from 'axios';
  import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { handlePrint } from '../handlePrint';

const UserBills = () => {
    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const [bills, setBills] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { id } = useParams();
    const API_Bills = `https://store-system-api.gleeze.com/api/bills/${id}/userBills`;

    const fetchData = useCallback(async () => {
        try {
            if (token) {
                setLoading(true);
                const response = await axios.get(`${API_Bills}?search=${searchInput}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
                setBills(response.data.data);
                setPagination(response.data.paginationResult);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    }, [token, searchInput, pagination.currentPge]);

    useEffect(() => {
        fetchData();
    }, [fetchData, searchInput, pagination.currentPge]);

    const handleDeleteBill = useCallback((billId) => {
        setSelectedBillId(billId);
        setShowConfirmation(true);
    }, []);

    const confirmDelete = useCallback(() => {
        axios
            .delete(`${API_Bills}/${selectedBillId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => fetchData())
            .catch((error) => console.error('Error deleting bill:', error))
            .finally(() => {
                setShowConfirmation(false);
                setSelectedBillId(null);
            });
    }, [selectedBillId, token, fetchData]);

    const cancelDelete = useCallback(() => {
        setShowConfirmation(false);
        setSelectedBillId(null);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setPagination(prevState => ({
            ...prevState,
            currentPge: newPage
        }));
    }, []);

    const handleSearch = () => {
        setPagination(prevState => ({
            ...prevState,
            currentPge: 1
        }));
        setSearchInput(searchTerm);
    };

    return (
        <div>
  
            <div className={styles.billsContainer}>
                <div className='flex gap-5'>
                    <div>
                        <input type="search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className='btn btn-primary' onClick={handleSearch}>
                              Search 
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className='m-5 fs-3 text-center'><Loading /></div>
                ) : (
                    <>
                        {bills.map((bill) => (
                            <div key={bill._id} className={styles.billsTable}>
                                <div className='flex'>
                                    <div>
                                        <p>
                                            Bill Code : {bill._id.slice(-4)}
                                        </p>
                                        <p>
                                            Client Name :    {bill.customerName}
                                        </p>
                                        <p>
                                         Phone : {bill.phone}
                                        </p>
                                        <p>
                                             customer Address :  {bill?.customerAddress}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                             Name Seller: {bill?.user.name}
                                        </p>
                                        <p>
                                            Bill Date : {bill?.createdAt && new Date(bill.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </p>
                                        <p>
                                            update Date : {bill?.updatedAt && new Date(bill.updatedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <PrintButton onPrint={() => handlePrint(bills, bill._id)} />
                                    </div>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th> product </th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>total price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.products.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product.product?.name}</td>
                                                <td>{product.product?.price}</td>
                                                <td>{product.productQuantity}</td>
                                                <td>{product.totalPrice}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan='2'>
                                                 Total :  {bill.totalAmount}
                                            </td>
                                            <td>
                                                 Paid :  {bill.paidAmount}
                                            </td>
                                            <td>
                                                Remaining :   {bill.remainingAmount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {decodedToken.role === "admin" &&
                                    <div className={styles.Actions}>
                                        <Link to={`/updateBills/${bill._id}`} className={styles.updateBtn}>
                                            Update
                                        </Link>
                                        <button className={styles.deleteBtn} onClick={() => handleDeleteBill(bill._id)}>
                                            Delete
                                        </button>

                                    </div>

                                }

                            </div>

                        ))}
                    </>
                )}

                <ConfirmationModal show={showConfirmation} onConfirm={confirmDelete} onCancel={cancelDelete} />
                {bills.length === 0 && <p>No bills available</p>}

            </div>
            <div className={styles.flex}>
                {pagination.prev && (
                    <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
                        {pagination.prev}
                    </button>
                )}
                <button className={styles.paginationNext}>Page {pagination.currentPge}</button>
                {pagination.next && (
                    <button className={styles.paginationNext} onClick={() => handlePageChange(pagination.next)}>
                        {pagination.next}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserBills;
