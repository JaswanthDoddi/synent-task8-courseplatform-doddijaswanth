import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            navigate('/login'); // Redirects to login page upon success
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Create Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                
                <div style={styles.inputGroup}>
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.button}>Register</button>
                <p style={styles.text}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

// Re-use the same styles object from the Login component
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' },
    form: { background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { marginBottom: '20px', textAlign: 'center', color: '#1e3c72' },
    inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem' },
    button: { width: '100%', padding: '12px', background: '#2a5298', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    error: { color: '#ef4444', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' },
    text: { marginTop: '15px', textAlign: 'center', fontSize: '0.9rem' }
};