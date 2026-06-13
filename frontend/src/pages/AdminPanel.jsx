import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form states for creating a course
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [moduleTitle, setModuleTitle] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [message, setMessage] = useState('');

    // Block non-admin users from accessing this view
    if (!user || user.role !== 'admin') {
        return <div style={{ padding: '40px', color: 'red' }}><h2>⛔ Access Denied. Admins Only.</h2></div>;
    }

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setMessage('');

        // Structuring a basic initial module and lesson structure based on input parameters
        const structuredModules = [
            {
                title: moduleTitle || "Introduction Module",
                lessons: [
                    {
                        title: lessonTitle || "First Lesson",
                        videoUrl: videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4" // Placeholder sample clip
                    }
                ]
            }
        ];

        try {
            const res = await axios.post('http://localhost:5000/api/courses', {
                title,
                description,
                price: Number(price),
                modules: structuredModules
            });
            setMessage('🎉 Course uploaded successfully!');
            // Clear fields
            setTitle('');
            setDescription('');
            setPrice('');
            setModuleTitle('');
            setLessonTitle('');
            setVideoUrl('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error publishing course content.');
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2>⚙️ Admin Control Panel</h2>
                <button onClick={() => navigate('/dashboard')} style={styles.navBtn}>Go to Student Dashboard</button>
            </header>

            {message && <div style={styles.alert}>{message}</div>}

            <form onSubmit={handleCreateCourse} style={styles.form}>
                <h3>Create & Publish a New Course</h3>
                
                <div style={styles.group}>
                    <label>Course Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.group}>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.textarea}/>
                </div>

                <div style={styles.group}>
                    <label>Price (INR)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={styles.input}/>
                </div>

                <h4 style={{marginTop: '20px', color: '#2a5298'}}>Initial Content Layer Structure</h4>
                
                <div style={styles.group}>
                    <label>Module Title</label>
                    <input type="text" placeholder="e.g., Getting Started with React" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.group}>
                    <label>First Lesson Title</label>
                    <input type="text" placeholder="e.g., Installing Vite Elements" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required style={styles.input}/>
                </div>

                <div style={styles.group}>
                    <label>Lesson Video Streaming URL</label>
                    <input type="url" placeholder="e.g., https://example.com/video.mp4" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required style={styles.input}/>
                </div>

                <button type="submit" style={styles.submitBtn}>Publish Course Elements</button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #cbd5e1', paddingBottom: '15px' },
    navBtn: { background: '#2a5298', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer' },
    form: { background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    group: { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem' },
    textarea: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem', height: '80px', resize: 'vertical' },
    submitBtn: { width: '100%', padding: '14px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' },
    alert: { padding: '15px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }
};