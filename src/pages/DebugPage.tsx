import { useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';

export default function DebugPage() {
    const navigate = useNavigate();
    const { selectedModels, listenerPreference } = useComparison();

    return (
        <div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
            <h1>DEBUG PAGE</h1>

            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid yellow' }}>
                <h2>localStorage Data:</h2>
                <pre>{JSON.stringify({
                    preference: localStorage.getItem('sonic_lab_listener_preference'),
                    comparison: localStorage.getItem('sonic_lab_comparison'),
                }, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid cyan' }}>
                <h2>Context Data:</h2>
                <pre>{JSON.stringify({
                    listenerPreference,
                    selectedModels,
                    count: selectedModels.length
                }, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => localStorage.clear()}
                    style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    CLEAR LOCALSTORAGE
                </button>

                <button
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    GO HOME
                </button>

                <button
                    onClick={() => navigate('/compare')}
                    style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    GO COMPARE
                </button>
            </div>
        </div>
    );
}
