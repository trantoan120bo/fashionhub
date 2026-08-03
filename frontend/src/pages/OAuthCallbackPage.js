import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error || !token || !userStr) {
            navigate('/login?error=oauth_failed', { replace: true });
            return;
        }

        try {
            const user = JSON.parse(decodeURIComponent(userStr));
            loginUser(token, user);
            navigate('/products', { replace: true });
        } catch {
            navigate('/login?error=oauth_failed', { replace: true });
        }
    }, [searchParams, loginUser, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '4px solid #ddd', borderTop: '4px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#666', fontSize: 14 }}>Đang xử lý đăng nhập...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default OAuthCallbackPage;
