import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses');
            setCourses(res.data);
        } catch (err) {
            console.error('Error grabbing catalog:', err);
        } finally {
            setLoading(false);
        }
    };

    // Simulated Checkout Flow integration
    const handleEnroll = async (courseId) => {
        try {
            // 1. Generate Order on the Backend
            const orderRes = await axios.post('http://localhost:5000/api/payments/checkout', { courseId });
            const { amount, id: order_id, currency } = orderRes.data.order;

            // 2. Configure Razorpay Modal Options
            const options = {
                key: "YOUR_RAZORPAY_TEST_KEY_ID", // Switch out with your actual sandbox ID
                amount: amount,
                currency: currency,
                name: "Synent Course Platform",
                description: "Test Mode Purchase",
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment Signature upon Success
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        courseId
                    };
                    const verifyRes = await axios.post('http://localhost:5000/api/payments/verify', verifyData);
                    if (verifyRes.data.success) {
                        alert("🎉 Enrollment Successful!");
                        window.location.reload(); // Refresh to update enrollment flags
                    }
                },
                theme: { color: "#2a5298" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Checkout initialization failed. Make sure your server is up.');
        }
    };

    // Filter logic for searching courses
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '40px' }}>Loading platform...</div>;

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1>Welcome, {user?.name}!</h1>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </header>

            <div style={styles.searchBarContainer}>
                <input 
                    type="text" 
                    placeholder="🔍 Search available courses..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchBar}
                />
            </div>

            <div style={styles.grid}>
                {filteredCourses.map(course => {
                    // Quick check if the student profile already includes this item id
                    const isEnrolled = user?.enrolledCourses?.includes(course._id);

                    return (
                        <div key={course._id} style={styles.card}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <p style={styles.price}>Price: ₹{course.price}</p>
                            
                            {isEnrolled ? (
                                <button style={styles.successBtn}>✔ Enrolled (Start Learning)</button>
                            ) : (
                                <button onClick={() => handleEnroll(course._id)} style={styles.enrollBtn}>Enroll Now</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    page: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
    logoutBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
    searchBarContainer: { marginBottom: '30px' },
    searchBar: { width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    price: { fontWeight: 'bold', margin: '15px 0', color: '#2a5298', fontSize: '1.1rem' },
    enrollBtn: { background: '#2a5298', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    successBtn: { background: '#2ecc71', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', width: '100%' }
};