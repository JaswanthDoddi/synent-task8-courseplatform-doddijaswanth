import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard'); // Directs user to dashboard on verification
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Sign In</h2>
                {error && <p style={styles.error}>{error}</p>}
                
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

                <button type="submit" style={styles.button}>Login</button>
                <p style={styles.text}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
}

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