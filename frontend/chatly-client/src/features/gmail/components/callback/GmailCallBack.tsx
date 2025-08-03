import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { postGoogleOAuthCode } from '../../api';
import useCallOnce from '../../../../shared/hooks/useCallOnce';
import { defaultChannels, useAppStore } from '../../../../store/Home/useAppStore';

function GmailCallBack() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    setActiveTab,
    setSelectedChannel
  } = useAppStore();
  useCallOnce(async () => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/?error=missing_code');
      return;
    }

    try {
      const data = await postGoogleOAuthCode(code);
      setActiveTab('accounts');
      setSelectedChannel(defaultChannels[1])
      navigate('/');
    } catch (error) {
      console.error('OAuth callback failed:', error);
      navigate('/?error=oauth_failed');
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 size={48} className="spin" />
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        Authenticating
      </div>
    );
  }

  return null;
}

export default GmailCallBack;
