import React, { useState } from 'react';

const UserProfile = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullname, setFullname] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleProfilePicChange = (e) => {
        setProfilePic(URL.createObjectURL(e.target.files[0]));
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Implement password change logic
        alert('Password changed successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <img
                        src={profilePic || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer">
                        <input type="file" onChange={handleProfilePicChange} className="hidden" />
                        <i className="fas fa-camera"></i>
                    </label>
                </div>
                <h1 className="text-2xl font-semibold mt-4">{fullname}</h1>
                <p className="text-gray-600">{email}</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                            Change Password
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Email Settings</h2>
                    <input
                        type="email"
                        placeholder="Update Email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Update Email
                    </button>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Notification Preferences</h2>
                    <div className="flex items-center justify-between">
                        <p>Email Notifications</p>
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p>SMS Notifications</p>
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" />
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
                    <button
                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
