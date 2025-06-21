import { useEffect, useState } from 'react';

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [editValues, setEditValues] = useState([]);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('api/leaderboardApi', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((body) => {
                let data = body.record || [];
                data.sort((a, b) => {
                    const ratioA = a.wins / a.losses || 0;
                    const ratioB = b.wins / b.losses || 0;
                    if (ratioA !== ratioB) return ratioB - ratioA;
                    return b.points - a.points;
                });
                setLeaderboardData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load the leaderboard.', err);
                setError('Could not load leaderboard.');
                setLoading(false);
            });
    }, []);

    const openPasswordPrompt = () => {
        setPasswordInput('');
        setPasswordError(null);
        setShowPasswordPrompt(true);
    };

    const onPasswordSubmit = async () => {
        const res = await fetch('/api/validate-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput }),
        });

        if (res.ok) {
            setShowPasswordPrompt(false);
            setIsEditing(true);
            setEditValues(leaderboardData.map((p) => ({ ...p })));
        } else {
            setPasswordError('Incorrect password, please try again.');
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setEditValues((prev) => {
            const newValues = [...prev];
            newValues[index] = {
                ...newValues[index],
                [name]: Number(value),
            };
            return newValues;
        });
    };

    const cancelEditAll = () => {
        setIsEditing(false);
        setEditValues([]);
    };

    const saveEditAll = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/leaderboardApi', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editValues),
            });
            if (!res.ok) throw new Error('Failed to save changes');
            setLeaderboardData(editValues);
            setIsEditing(false);
            setEditValues([]);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <svg
                className="animate-spin h-10 w-10 text-red-950"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
            </svg>
            <span className="sr-only">Loading leaderboard...</span>
        </div>
    );

    if (error)
        return (
            <div className="text-red-600 text-center mt-10">{error}</div>
        );

    return (
        <>
            {showPasswordPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4 text-center text-black">Enter Password to Edit</h3>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onPasswordSubmit()}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:ring-red-950 text-black"
                            autoFocus
                        />
                        {passwordError && (
                            <p className="text-red-600 text-sm mb-2">{passwordError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowPasswordPrompt(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onPasswordSubmit}
                                className="px-4 py-2 bg-red-950 text-white rounded hover:bg-red-950 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">40k Escalation League Leaderboard</h2>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-950 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Player</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Record W-L-T</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total Points</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200 shadow-lg">
                        {(isEditing ? editValues : leaderboardData).map((player, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {i + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {player.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="number"
                                                name="wins"
                                                value={player.wins}
                                                onChange={(e) => handleChange(e, i)}
                                                className="w-16 border border-gray-300 rounded px-2 mr-1"
                                            />
                                            -
                                            <input
                                                type="number"
                                                name="losses"
                                                value={player.losses}
                                                onChange={(e) => handleChange(e, i)}
                                                className="w-16 border border-gray-300 rounded px-2 ml-1"
                                            />
                                            -
                                            <input
                                                type="number"
                                                name="ties"
                                                value={player.ties}
                                                onChange={(e) => handleChange(e, i)}
                                                className="w-16 border border-gray-300 rounded px-2 ml-1"
                                            />
                                        </>
                                    ) : (
                                        `${player.wins} - ${player.losses} - ${player.ties}`
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-950">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="points"
                                            value={player.points}
                                            onChange={(e) => handleChange(e, i)}
                                            className="w-20 border border-gray-300 rounded px-2"
                                        />
                                    ) : (
                                        player.points
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-6 flex justify-center gap-4">
                    {!isEditing ? (
                        <button
                            className="bg-red-950 hover:bg-red-950 text-white px-6 py-2 rounded transition"
                            onClick={openPasswordPrompt}
                        >
                            Edit Leaderboard
                        </button>
                    ) : (
                        <>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
                                onClick={saveEditAll}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save All'}
                            </button>
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded transition"
                                onClick={cancelEditAll}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
